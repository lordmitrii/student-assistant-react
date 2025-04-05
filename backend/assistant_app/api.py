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
        return Response({'status': 'ok', 'user': {'username': user.username}})
    
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
def api_courses(request):
    courses = Course.objects.filter(user=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


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


######################################## Grades endpoints #########################################
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_grades(request, course_slug=None):
    # If a course slug is provided, filter grades for that specific course
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