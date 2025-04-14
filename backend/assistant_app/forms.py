from django import forms
from .models import Course, Grade, Assignment

# These fields are used in the admin interface to display the course and assignment names along with the user who created them.
class CourseChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return f"{obj.course_name} (User: {obj.user.username})"

class AssignmentChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return f"{obj.name} - {obj.course.course_name} (User: {obj.course.user.username})"

class GradeChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return f"Grade: {obj.grade} ({obj.course.course_name} - {obj.course.user.username})"

class AssignmentAdminForm(forms.ModelForm):
    course = CourseChoiceField(queryset=Course.objects.all())

    class Meta:
        model = Assignment
        fields = '__all__'

class GradeAdminForm(forms.ModelForm):
    course = CourseChoiceField(queryset=Course.objects.all())

    class Meta:
        model = Grade
        fields = '__all__'
