// This function will be available globally
function getPageStructure() {
  const structure = {
    title: document.title,
    headings: [],
    links: document.links.length,
    images: document.images.length,
    paragraphs: document.getElementsByTagName('p').length
  };

  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
    const elements = document.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
      structure.headings.push({
        level: tag,
        text: elements[i].textContent.trim()
      });
    }
  });

  return structure;
}

// We can add more utility functions here as needed