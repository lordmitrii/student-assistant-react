from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .models import Course, Grade, Assignment, News
from .serializers import CourseSerializer, GradeSerializer, AssignmentSerializer, NewsSerializer
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

@ensure_csrf_cookie
def csrf_cookie(request):
    return JsonResponse({"message": "CSRF cookie set"})

@api_view(['POST'])
@permission_classes([])
def api_login(request):
    if request.user.is_authenticated:
        logout(request)
    
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'status': 'ok', 'user': {'username': user.username}})
    
    return Response({'status': 'error', 'message': 'Invalid credentials'}, status=401)      

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_courses(request):
    courses = Course.objects.filter(user=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_course_detail(request, slug):
    course = get_object_or_404(Course, course_slug=slug, user=request.user)
    serializer = CourseSerializer(course)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_grades(request):
    grades = Grade.objects.filter(course__user=request.user)
    serializer = GradeSerializer(grades, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_assignments(request):
    assignments = Assignment.objects.filter(course__user=request.user)
    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_news(request):
    news = News.objects.filter(is_published=True).order_by('-date_posted')[:3]
    serializer = NewsSerializer(news, many=True)
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
    for i, g in enumerate(grades):
        data[i]['course_name'] = g.course.course_name
        data[i]['assignment_name'] = g.assignment.name if g.assignment else None
    return Response(data)

@api_view(['GET'])
def api_latest_news(request):
    news = News.objects.filter(is_published=True).order_by('-date_posted')[:3]
    return Response(NewsSerializer(news, many=True).data)