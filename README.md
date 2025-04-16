# Student Assistant

## Project Description

**Student Assistant** is a web application designed to help students track academic deadlines and manage their grades.

Users can:
- Add, edit, and delete courses
- Assign deadlines for assignments, quizzes, and projects
- Input grades for deadlines or record them independently
- Sort deadlines by date to better organize their academic schedule
- Use calculator to calculate weighted average
- See recent grades, upcoming deadlines and latest news on the home page



## Getting Started

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Create a virtual environment:

    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:

    - On **macOS/Linux**:

        ```bash
        source venv/bin/activate
        ```

    - On **Windows**:

        ```bash
        venv\Scripts\activate
        ```

4. Install the dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Run the backend server:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```


### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm run dev
    ```

## Docker

This project is fully containerized for rapid deployment. All you have to do:

1. Install docker, docker-compose and make sure it is running.

2. Build the images:

```bash
docker-compose build
```

3. Run the containers

```bash
docker-compose up
```


## Sources Used

- [Bootstrap v5.3.3](https://getbootstrap.com/)
- [Google OAuth v2.0](https://developers.google.com/identity)
- [Django-Allauth v0.65.5](https://django-allauth.readthedocs.io)
- [PyJWT v2.6.0](https://pypi.org/project/PyJWT/)
- [React](https://react.dev/)


## Credits

This project was originally built with a group of students. The original version can be found at: [StudentAssistant](https://github.com/lordmitrii/StudentAssistant)

This version builds on the original by adding a React frontend.
