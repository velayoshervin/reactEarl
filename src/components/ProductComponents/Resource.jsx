import React from "react";
import "./resource.css";

const Resource = () => {
  return (
    <>
      <section class="resources-header">
        <h1>Resources for Event Planning</h1>
        <p>
          Helpful guides and information to make your special occasions seamless
          and stylish.
        </p>
      </section>

      <main class="resources-content">
        <article class="resource-item">
          <h2>📋 Event Planning Checklist</h2>
          <p>
            Organizing an event can feel overwhelming, so here’s a simple
            checklist you can follow:
          </p>
          <ul>
            <li>Book your venue 6–12 months in advance.</li>
            <li>Create and finalize your guest list.</li>
            <li>Decide on catering and menu options.</li>
            <li>Arrange décor and styling that matches your theme.</li>
            <li>Confirm entertainment or program flow.</li>
            <li>Schedule photography and videography coverage.</li>
            <li>Double-check logistics (transportation, seating, etc.).</li>
          </ul>
        </article>

        <article class="resource-item">
          <h2>💰 Budget Planner Guide</h2>
          <p>
            Budgeting is essential in making sure your event stays realistic and
            stress-free. A suggested breakdown is:
          </p>
          <ul>
            <li>
              <strong>Venue:</strong> 30–40% of total budget
            </li>
            <li>
              <strong>Food & Catering:</strong> 20–30%
            </li>
            <li>
              <strong>Décor & Styling:</strong> 10–15%
            </li>
            <li>
              <strong>Photo & Video:</strong> 10%
            </li>
            <li>
              <strong>Entertainment:</strong> 5–10%
            </li>
            <li>
              <strong>Miscellaneous & Emergency Fund:</strong> 5–10%
            </li>
          </ul>
        </article>

        <article class="resource-item">
          <h2>🎨 Style Inspiration Ideas</h2>
          <p>Some popular event styles you can consider:</p>
          <ul>
            <li>
              <strong>Weddings:</strong> Rustic, Garden Elegance, Classic White,
              Modern Minimalist
            </li>
            <li>
              <strong>Birthdays:</strong> Glam Hollywood, Whimsical Fairytale,
              Pastel Chic, Themed Parties
            </li>
            <li>
              <strong>Corporate Events:</strong> Formal Banquet, Hybrid
              Meetings, Branded Modern Décor
            </li>
          </ul>
        </article>

        <article class="resource-item">
          <h2>🤝 Choosing Vendors</h2>
          <p>
            Partnering with the right vendors makes planning easier. Here’s what
            to look for:
          </p>
          <ul>
            <li>
              <strong>Caterers:</strong> Quality food, variety, and service
              reliability
            </li>
            <li>
              <strong>Photographers/Videographers:</strong> Style of work
              matches your preference
            </li>
            <li>
              <strong>Florists/Decorators:</strong> Experience with your chosen
              theme
            </li>
            <li>
              <strong>Stylists (Hair & Makeup):</strong> Trials available before
              the event
            </li>
          </ul>
        </article>

        <article class="resource-item">
          <h2>🎒 Event Day Survival Kit</h2>
          <p>Don’t forget these small but essential items on event day:</p>
          <ul>
            <li>Safety pins, scissors, and double-sided tape</li>
            <li>Power bank and extra charging cables</li>
            <li>First-aid kit and basic medicines</li>
            <li>Snacks and bottled water</li>
            <li>Extra makeup, blotting paper, tissues</li>
          </ul>
        </article>

        <article class="resource-item">
          <h2>📖 Quick Tips for a Successful Event</h2>
          <ul>
            <li>Always have a backup plan (especially for outdoor events).</li>
            <li>
              Communicate regularly with vendors and confirm details twice.
            </li>
            <li>
              Assign someone trustworthy as your “point person” for the day.
            </li>
            <li>Stay realistic with your budget—focus on priorities first.</li>
            <li>
              Enjoy the process and let the professionals handle the details.
            </li>
          </ul>
        </article>

        <article class="resource-item highlight">
          <h2>✨ Need Personalized Help?</h2>
          <p>
            If you’d like us to design and manage your event from start to
            finish, we offer customized planning and styling services. Reach out
            anytime for consultations tailored to your needs.
          </p>
        </article>
      </main>
    </>
  );
};

export default Resource;
