import { ReactDOM } from "react";

const resume = (
  <div id="root">
    Software Engineer, Vietnam Tech Society
    <ul>
      <li>
        Worked in an engineering team to optimize the performance and
        responsiveness of the mentor-mentee platform.
      </li>
      <li>
        Worked closely with product owner to locate customer’s pain points
        through logs and monitoring tools.
      </li>
      <li>
        Created and tested a microservice that coordinates mentorship
        schedules using the MVC design.
      </li>
      <li>
        Optimized application with cache to eliminate recurrent API calls,
        improving response time by 70%.
      </li>
      <li>
        Integrated webhooks to reduce code complexity and increase agility,
        scalability and extensibility.
      </li>
    </ul>
  </div>
);

const Resume = () => {
  return (
    <>
      <div className='text-sm'>{resume}</div>
    </>
  );
};

export default Resume;
