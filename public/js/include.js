async function includeHTML() {
  const includeElements = document.querySelectorAll('[data-include]');

  for (const el of includeElements) {
    const file = el.getAttribute('data-include');
    const response = await fetch(file);
    if (response.ok) {
      const html = await response.text();
      el.innerHTML = html;
    } else {
      el.innerHTML = "Component not found.";
    }
  }
}

document.addEventListener("DOMContentLoaded", includeHTML);
