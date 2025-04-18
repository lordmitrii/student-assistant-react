from rest_framework import serializers
from .models import Course, Grade, Assignment, News

class CourseSerializer(serializers.ModelSerializer):
    average_grade = serializers.FloatField(required=False)
    due_assignments = serializers.IntegerField(required=False)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['average_grade', 'due_assignments', 'course_slug', 'user']




class GradeSerializer(serializers.ModelSerializer):
    assignment_name = serializers.SerializerMethodField(required=False)
    assignment_id = serializers.SerializerMethodField(required=False)
    course_name = serializers.SerializerMethodField(required=False)
    course_slug = serializers.SerializerMethodField(required=False)
    
    class Meta:
        model = Grade
        fields = '__all__'
        read_only_fields = ['assignment_name', 'assignment_id', 'course_name', 'course_slug', 'course']


    def get_course_name(self, obj):
        return obj.course.course_name if obj.course else None
    
    def get_course_slug(self, obj):
        return obj.course.course_slug if obj.course else None
    
    def get_assignment_name(self, obj):
        if hasattr(obj, 'assignment'):
            return obj.assignment.name
        return None
    
    def get_assignment_id(self, obj):
        if hasattr(obj, 'assignment'):
            return obj.assignment.id
        return None

class AssignmentSerializer(serializers.ModelSerializer):
    grade_val = serializers.SerializerMethodField(required=False)
    course_name = serializers.SerializerMethodField(required=False)
    course_slug = serializers.SerializerMethodField(required=False)
    
    class Meta:
        model = Assignment
        fields = '__all__'
        read_only_fields = ['grade_val', 'couse_name', 'course_slug', 'course']

    def get_grade_val(self, obj):
        return obj.grade.grade if obj.grade else None
    
    def get_course_name(self, obj):
        return obj.course.course_name if obj.course else None
    
    def get_course_slug(self, obj):
        return obj.course.course_slug if obj.course else None

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
