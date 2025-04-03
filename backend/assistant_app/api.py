from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Course, Grade, Assignment, News
from .serializers import CourseSerializer, GradeSerializer, AssignmentSerializer, NewsSerializer
from django.shortcuts import get_object_or_404

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