const About = () => {
  return (
    <div class="container-fluid custom-container">
      <div class="row mb-5">
        <div class="col-md-12">
          <h2 class="mb-4 text-center">About This Project</h2>
          <p class="lead">
            Welcome to the Student Assistant project! This application is
            designed to streamline student experience by providing a
            deadline/grade management application. This tool helps students keep
            track of their assignments, grades, and deadlines, ensuring they
            stay organized and on top of their academic responsibilities.
          </p>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-3">Credentials</h3>
              <p>
                Originally this project was built as a fully Django-based application with a group of students. This
                version builds on the original and now incorporates a React frontend to deliver a better user
                experience.
              </p>
              <p>
                Explore the original project on GitHub:{" "}
                <a
                  href="https://github.com/lordmitrii/StudentAssistant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-weight-bold"
                >
                  StudentAssistant
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-3">Our Project</h3>
              <p>
                Student Assistant aims to simplify academic management by
                providing tools to track courses, assignments, and grades in one
                centralized location. We believe that with proper organization,
                students can reduce stress and improve their academic
                performance.
              </p>

              <h4 class="mt-4 mb-3">Key Features</h4>
              <ul>
                <li>Course management with average grade tracking</li>
                <li>Assignment tracking with deadline reminders</li>
                <li>Grade recording and GPA calculation</li>
                <li>Simple, intuitive interface for ease of use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4 mb-5">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-3">How to Use</h3>
              <p>
                Get started by registering an account and adding your courses.
                From there, you can track assignments, record grades, and
                monitor your academic progress throughout the semester.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
