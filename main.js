// Smooth scroll navigation
document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    }
  });
});

// Fetch JSON and populate dynamic sections
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    // ---- Dynamic word rotator in hero ----
    const words = data.dynamicWords || [];
    const wordSpan = document.querySelector('.dynamic-word');
    let index = 0;
    function rotateWord() {
      wordSpan.textContent = words[index];
      index = (index + 1) % words.length;
    }
    if (words.length > 0) {
      rotateWord();
      setInterval(rotateWord, 2000);
    }

    // ---- Skills section ----
    const skillsList = document.getElementById('skills-list');
    if (skillsList && data.skills) {
      skillsList.innerHTML = data.skills.map(skill => `
        <div class="skill-card">
          <h3>${skill.name}</h3>
          <div class="progress-bar"><span style="width:${skill.level}%"></span></div>
          <p>${skill.level}% — ${skill.description}</p>
        </div>
      `).join('');
    }

    // ---- Projects section ----
    const projectsList = document.getElementById('projects-list');
    if (projectsList && data.projects) {
      projectsList.innerHTML = data.projects.map(proj => `
        <div class="project-card">
          <h3>${proj.title}</h3>
          <p>${proj.description}</p>
          <a href="${proj.link}" target="_blank" rel="noopener">View Project</a>
        </div>
      `).join('');
    }

    // ---- Competitive Programming Profiles ----
    const cpSection = document.querySelector('.cp-exposure ul');
    if (cpSection && data.cpProfiles) {
      cpSection.innerHTML = data.cpProfiles.map(p => `
        <li><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a></li>
      `).join('');
    }
  });

// ---- Contact form (Formspree) ----
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.textContent = 'Sending...';
    const formData = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (res.ok) {
        statusEl.textContent = 'Message sent successfully!';
        form.reset();
      } else {
        statusEl.textContent = 'Error sending message.';
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Please try again.';
    }
  });
}
