from django.test import TestCase
from django.contrib.auth.models import User
from assistant_app.models import Course, Grade, Assignment, News
from assistant_app.serializers import CourseSerializer, GradeSerializer, AssignmentSerializer, NewsSerializer
from datetime import timedelta
from django.utils.timezone import now

class SerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='pass1234')
        self.course = Course.objects.create(course_name="Test Course", user=self.user)
        self.assignment = Assignment.objects.create(
            name="Test Assignment",
            course=self.course,
            deadline=now() + timedelta(days=7),
            is_done=False
        )
        self.grade = Grade.objects.create(
            course=self.course,
            grade=85.0,
            date=now(),
            credits=3
        )
        self.assignment.grade = self.grade
        self.assignment.save()

        self.news = News.objects.create(
            title="Test News",
            content="This is test news content.",
            is_published=True,
            date_posted=now()
        )

    def test_course_serializer_fields(self):
        serializer = CourseSerializer(instance=self.course)
        data = serializer.data
        self.assertIn('course_name', data)
        self.assertIn('course_slug', data)
        self.assertIn('user', data)

    def test_grade_serializer_fields_and_methods(self):
        serializer = GradeSerializer(instance=self.grade)
        data = serializer.data
        self.assertEqual(data['grade'], 85.0)
        self.assertEqual(data['credits'], 3)
        self.assertEqual(data['course_name'], self.course.course_name)
        self.assertEqual(data['course_slug'], self.course.course_slug)
        self.assertEqual(data['assignment_name'], self.assignment.name)
        self.assertEqual(data['assignment_id'], self.assignment.id)

    def test_assignment_serializer_fields_and_methods(self):
        serializer = AssignmentSerializer(instance=self.assignment)
        data = serializer.data
        self.assertEqual(data['name'], "Test Assignment")
        self.assertEqual(data['grade_val'], 85.0)
        self.assertEqual(data['course_name'], self.course.course_name)
        self.assertEqual(data['course_slug'], self.course.course_slug)

    def test_news_serializer_fields(self):
        serializer = NewsSerializer(instance=self.news)
        data = serializer.data
        self.assertEqual(data['title'], "Test News")
        self.assertEqual(data['content'], "This is test news content.")
        self.assertTrue(data['is_published'])
