from django.test import SimpleTestCase
from django.urls import reverse, resolve
from assistant_app import views

class TestAssistantAppUrls(SimpleTestCase):

    def test_api_courses_url(self):
        url = reverse('assistant_app:api_courses')
        self.assertEqual(resolve(url).func, views.api_courses)

    def test_api_courses_slug_url(self):
        url = reverse('assistant_app:api_courses_slug', args=['test-course'])
        self.assertEqual(resolve(url).func, views.api_courses)

    def test_api_all_grades_url(self):
        url = reverse('assistant_app:api_all_grades')
        self.assertEqual(resolve(url).func, views.api_grades)

    def test_api_grade_modify_url(self):
        url = reverse('assistant_app:api_grade', args=['1'])
        self.assertEqual(resolve(url).func, views.api_grades_modify)

    def test_api_grades_for_course_url(self):
        url = reverse('assistant_app:api_grades_for_course', args=['test-course'])
        self.assertEqual(resolve(url).func, views.api_grades)

    def test_api_all_assignments_url(self):
        url = reverse('assistant_app:api_all_assignments')
        self.assertEqual(resolve(url).func, views.api_assignments)

    def test_api_assignment_modify_url(self):
        url = reverse('assistant_app:api_assignment', args=['1'])
        self.assertEqual(resolve(url).func, views.api_assignments_modify)

    def test_api_assignments_for_course_url(self):
        url = reverse('assistant_app:api_assignments_for_course', args=['test-course'])
        self.assertEqual(resolve(url).func, views.api_assignments)

    def test_api_assignment_complete_url(self):
        url = reverse('assistant_app:api_assignment_complete', args=['1'])
        self.assertEqual(resolve(url).func, views.api_assignments_complete)

    def test_csrf_cookie_url(self):
        url = reverse('assistant_app:csrf_cookie')
        self.assertEqual(resolve(url).func, views.csrf_cookie)

    def test_get_user_url(self):
        url = reverse('assistant_app:get_user')
        self.assertEqual(resolve(url).func, views.get_user)

    def test_api_login_url(self):
        url = reverse('assistant_app:api_login')
        self.assertEqual(resolve(url).func, views.api_login)

    def test_api_logout_url(self):
        url = reverse('assistant_app:api_logout')
        self.assertEqual(resolve(url).func, views.api_logout)

    def test_api_register_url(self):
        url = reverse('assistant_app:api_register')
        self.assertEqual(resolve(url).func, views.api_register)

    def test_api_upcoming_deadlines_url(self):
        url = reverse('assistant_app:api_upcoming_deadlines')
        self.assertEqual(resolve(url).func, views.api_upcoming_deadlines)

    def test_api_recent_grades_url(self):
        url = reverse('assistant_app:api_recent_grades')
        self.assertEqual(resolve(url).func, views.api_recent_grades)

    def test_api_news_latest_url(self):
        url = reverse('assistant_app:api_news_latest')
        self.assertEqual(resolve(url).func, views.api_latest_news)

    def test_redirect_to_home_url(self):
        url = reverse('assistant_app:redirect_to_home')
        self.assertIsNotNone(resolve(url).func)
