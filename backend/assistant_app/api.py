from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import Course, Grade, Assignment, News
from .serializers import CourseSerializer, GradeSerializer, AssignmentSerializer, NewsSerializer
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Sum, F, ExpressionWrapper, FloatField, Count, Q

@ensure_csrf_cookie
def csrf_cookie(request):
    return JsonResponse({"message": "CSRF cookie set"})

@api_view(['POST'])
@permission_classes([])
def api_login(request):
    # print(request.user.is_authenticated)
    # if request.user.is_authenticated:
    #     logout(request)
    
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
                "status": 'ok',
                "isAuthenticated": True,
                "user": {
                    "username": request.user.username,
                    "email": request.user.email,
                    "date_joined": request.user.date_joined,
                    "last_login": request.user.last_login
                }
            })
    
    return Response({'status': 'error', 'message': 'Invalid credentials'}, status=401)      


@api_view(['POST'])
@permission_classes([])
def api_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return Response({'status': 'ok', 'message': 'Logged out successfully'})
    return Response({'status': 'error', 'message': 'User not logged in'}, status=401)


@api_view(['GET'])
@permission_classes([])
def get_user(request):
    if request.user.is_authenticated:
        return Response({
            "isAuthenticated": True,
            "user": {
                "username": request.user.username,
                "email": request.user.email,
                "date_joined": request.user.date_joined,
                "last_login": request.user.last_login
            }
        })
    return Response({"isAuthenticated": False})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_upcoming_deadlines(request):
    assignments = Assignment.objects.filter(course__user=request.user, is_done=False).order_by('deadline')[:5]
    for a in assignments:
        a.remaining_days = (a.deadline - now()).days  # Add this manually to serializer if needed
    data = AssignmentSerializer(assignments, many=True).data
    for i, d in enumerate(assignments):
        data[i]['course_name'] = d.course.course_name
        data[i]['remaining_days'] = (d.deadline - now()).days
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_recent_grades(request):
    grades = Grade.objects.filter(course__user=request.user).order_by('-date')[:5]
    data = GradeSerializer(grades, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes([])
def api_latest_news(request):
    news = News.objects.filter(is_published=True).order_by('-date_posted')[:3]
    return Response(NewsSerializer(news, many=True).data)

######################################### Courses endpoints #########################################


@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_courses(request, course_slug=None):
    if request.method == 'GET':
        if course_slug:
            course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
            data = CourseSerializer(course).data
            return Response(data)
        else:
            courses = Course.objects.filter(user=request.user).annotate(
                total_weighted_grades=Sum(F('grades__grade') * F('grades__credits'), output_field=FloatField()),
                total_credits=Sum('grades__credits', output_field=FloatField()),
                due_assignments=Count('assignments', filter=Q(assignments__is_done=False), distinct=True)
            ).annotate(
                average_grade=ExpressionWrapper((F('total_weighted_grades') / F('total_credits')), output_field=FloatField())
            )
            data = CourseSerializer(courses, many=True).data
            return Response(data)

    elif request.method == 'POST':
        course = CourseSerializer(data=request.data)
        if course.is_valid():
            course.save(user=request.user)
            return Response(course.data, status=201)
        return Response(course.errors, status=400)

    elif request.method == 'PATCH':
        course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
        course.delete()
        return Response(status=204)


######################################## Grades endpoints #########################################
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_grades(request, course_slug=None):
    if course_slug:
        course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
        course_grades = Grade.objects.filter(course=course)
        average_grade = course_grades.aggregate(
            total_weighted_grades=Sum(F('grade') * F('credits'), output_field=FloatField()),
            total_credits=Sum('credits', output_field=FloatField())
        )
        if average_grade['total_credits']:
            course_average = average_grade['total_weighted_grades'] / average_grade['total_credits']
        else:
            course_average = None


        data = GradeSerializer(course_grades, many=True).data
        return Response({
            'grades': data,
            'average': course_average
        })
    
    # If no course slug is provided, show all grades for the user
    else:
        grades_exist = False
        grades_by_course = {}
        courses = Course.objects.filter(user=request.user)
        average_grade = Grade.objects.filter(course__user=request.user).aggregate(
                                total_weighted_grades=Sum(F('grade') * F('credits'), output_field=FloatField()),
                                total_credits=Sum('credits', output_field=FloatField())
                                )
        if average_grade['total_credits']:
            overall_average = average_grade['total_weighted_grades'] / average_grade['total_credits']
        else:
            overall_average = None
        
        # Check if any course has grades and prepare the data for rendering
        for course in courses:
            if course.grades.exists():
                grades_exist = True
                break

        if grades_exist:
            for course in courses:
                course_grades = Grade.objects.filter(course=course)
                grades_by_course[course.course_slug] = GradeSerializer(course_grades, many=True).data

        

        return Response({
            'grades': grades_by_course,
            'average': overall_average,
        })
    
@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_grades_modify(request, grade_id=None):
    if request.method == 'GET':
        if grade_id:
            grade = get_object_or_404(Grade, id=grade_id, course__user=request.user)
            data = GradeSerializer(grade).data
            return Response(data)
        else:
            grades = Grade.objects.filter(course__user=request.user)
            data = GradeSerializer(grades, many=True).data
            return Response(data)
    elif request.method == 'POST':
        course_slug = request.data.get('course_slug')
        course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
        grade = GradeSerializer(data=request.data)
        if grade.is_valid():
            grade.save(course=course)
            return Response(grade.data, status=201)
        return Response(grade.errors, status=400)

    elif request.method == 'PATCH':
        grade = get_object_or_404(Grade, id=grade_id)
        serializer = GradeSerializer(grade, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        grade = get_object_or_404(Grade, id=grade_id)
        grade.delete()
        return Response(status=204)
    

######################################### Assignments endpoints #########################################

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_assignments(request, course_slug=None):
    if course_slug:
        course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
        course_assignments = Assignment.objects.filter(course=course)
        due_assignments_count = Assignment.objects.filter(course=course, is_done=False).count()
        

        data = AssignmentSerializer(course_assignments, many=True).data
        return Response({
            'assignments': data,
            'due_count': due_assignments_count
        })
    
    # If no course slug is provided, show all assignments for the user
    else:
        assignments_exist = False
        assignments_by_course = {}
        courses = Course.objects.filter(user=request.user)
        due_assignments_count = Assignment.objects.filter(course__user=request.user, is_done=False).count()

        # Check if any course has assignments and prepare the data for rendering
        for course in courses:
            if course.assignments.exists():
                assignments_exist = True
                break

        if assignments_exist:
            for course in courses:
                course_assignments = Assignment.objects.filter(course=course)
                assignments_by_course[course.course_slug] = AssignmentSerializer(course_assignments, many=True).data


        return Response({
            'assignments': assignments_by_course,
            'due_count': due_assignments_count,
        })
    
@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_assignments_modify(request, assignment_id=None):
    if request.method == 'GET':
        if assignment_id:
            assignment = get_object_or_404(Assignment, id=assignment_id, course__user=request.user)
            data = AssignmentSerializer(assignment).data
            return Response(data)
        else:
            assignments = Assignment.objects.filter(course__user=request.user)
            data = AssignmentSerializer(assignments, many=True).data
            return Response(data)
    elif request.method == 'POST':
        course_slug = request.data.get('course_slug')
        course = get_object_or_404(Course, course_slug=course_slug, user=request.user)
        assignment = AssignmentSerializer(data=request.data)
        if assignment.is_valid():
            assignment.save(course=course)
            return Response(assignment.data, status=201)
        return Response(assignment.errors, status=400)

    elif request.method == 'PATCH':
        assignment = get_object_or_404(Assignment, id=assignment_id)
        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        assignment = get_object_or_404(Assignment, id=assignment_id)
        assignment.delete()
        return Response(status=204)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def api_assignments_complete(request, assignment_id):
    assignment = get_object_or_404(Assignment, id=assignment_id, course__user=request.user)
    assignment.is_done = not assignment.is_done
    assignment.save()
    return Response({'status': 'ok', 'is_done': assignment.is_done})