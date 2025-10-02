document.addEventListener("DOMContentLoaded", () => {
  // Select all .meta-item elements
  const metaItems = document.querySelectorAll(".meta-item");

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add 'visible' class when the element is in the viewport
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
    },
  );

  // Observe each meta-item
  metaItems.forEach((item) => observer.observe(item));
});
