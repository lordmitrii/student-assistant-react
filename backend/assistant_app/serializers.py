from rest_framework import serializers
from .models import Course, Grade, Assignment, News

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    assignment_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    class Meta:
        model = Grade
        fields = '__all__'


    def get_course_name(self, obj):
        return obj.course.course_name if obj.course else None
    
    def get_assignment_name(self, obj):
        if hasattr(obj, 'assignment'):
            return obj.assignment.name
        return None

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
