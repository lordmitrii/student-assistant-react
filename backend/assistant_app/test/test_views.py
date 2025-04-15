from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient

class AuthViewsTest(APITestCase):

    def setUp(self):
        self.username = "testuser"
        self.password = "testpass123"
        self.user = User.objects.create_user(username=self.username, password=self.password)
        self.client = APIClient()

    def test_csrf_cookie_set(self):
        url = reverse('assistant_app:csrf_cookie')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'CSRF cookie set')

    def test_register_new_user(self):
        url = reverse('assistant_app:api_register')
        response = self.client.post(url, {'username': 'newuser', 'password': 'newpass'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['status'], 'ok')

    def test_register_existing_user(self):
        url = reverse('assistant_app:api_register')
        response = self.client.post(url, {'username': self.username, 'password': 'whatever'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['status'], 'error')

    def test_login_success(self):
        url = reverse('assistant_app:api_login')
        response = self.client.post(url, {'username': self.username, 'password': self.password})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'ok')
        self.assertTrue(response.data['isAuthenticated'])

    def test_login_fail(self):
        url = reverse('assistant_app:api_login')
        response = self.client.post(url, {'username': self.username, 'password': 'wrongpass'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['status'], 'error')

    def test_logout_authenticated(self):
        self.client.login(username=self.username, password=self.password)
        url = reverse('assistant_app:api_logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'ok')

    def test_logout_unauthenticated(self):
        url = reverse('assistant_app:api_logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['status'], 'error')

    def test_get_user_authenticated(self):
        self.client.login(username=self.username, password=self.password)
        url = reverse('assistant_app:get_user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['isAuthenticated'])

    def test_get_user_unauthenticated(self):
        url = reverse('assistant_app:get_user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['isAuthenticated'])
