// JavaScript for managing papers data and display

// Sample paper data (in a real application, this would come from a database or API)
const papersData = [
  {
    id: 1,
    title: "The Economic Impact of the Black Death in Medieval Europe",
    author: "Emma Johnson",
    institution: "University of Oxford",
    abstract:
      "This paper examines the profound economic changes that occurred in Europe following the Black Death pandemic of the 14th century. It analyzes the shift in labor relations, wage increases, and the decline of feudalism as consequences of population decline.",
    category: "medieval",
    tags: ["Black Death", "Economic History", "Medieval Europe", "Feudalism"],
    publicationDate: "2025-05-15",
    imageUrl: "images/medieval-economics.jpg",
    pdfUrl: "#",
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: 2,
    title:
      "Colonial Policies and Indigenous Resistance in North America: 1750-1850",
    author: "Michael Chen",
    institution: "Stanford University",
    abstract:
      "This research explores the various strategies of resistance employed by indigenous peoples in North America in response to expanding colonial powers. It focuses on diplomatic negotiations, military alliances, and cultural adaptations as forms of agency.",
    category: "us",
    tags: [
      "Colonial America",
      "Indigenous Peoples",
      "Resistance",
      "North America",
    ],
    publicationDate: "2025-04-22",
    imageUrl: "images/colonial-america.jpg",
    pdfUrl: "#",
    rating: 4.5,
    reviewCount: 8,
  },
  {
    id: 3,
    title: "Women's Roles in the Ancient Greek Economy",
    author: "Sophia Martinez",
    institution: "UCLA",
    abstract:
      "This study challenges traditional narratives about women's economic participation in Ancient Greece. Through analysis of archaeological evidence and textual sources, it demonstrates women's significant contributions to textile production, agriculture, and commerce.",
    category: "ancient",
    tags: [
      "Ancient Greece",
      "Women's History",
      "Economic History",
      "Gender Studies",
    ],
    publicationDate: "2025-06-01",
    imageUrl: "images/greek-women.jpg",
    pdfUrl: "#",
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: 4,
    title:
      "The Evolution of Diplomatic Relations Between the USSR and China: 1949-1989",
    author: "Alexander Wilson",
    institution: "London School of Economics",
    abstract:
      "This paper analyzes the complex and evolving relationship between the Soviet Union and China during the Cold War. It examines ideological differences, border conflicts, and geopolitical considerations that shaped their diplomatic engagement.",
    category: "modern",
    tags: ["Cold War", "USSR", "China", "Diplomatic History"],
    publicationDate: "2025-03-10",
    imageUrl: "images/ussr-china.jpg",
    pdfUrl: "#",
    rating: 4.6,
    reviewCount: 7,
  },
  {
    id: 5,
    title: "Environmental Factors in the Collapse of Maya Civilization",
    author: "Olivia Thompson",
    institution: "University of Chicago",
    abstract:
      "This research examines the role of environmental changes, including drought and deforestation, in the decline of Classic Maya civilization. It integrates archaeological evidence with paleoclimatological data to present a comprehensive analysis.",
    category: "world",
    tags: ["Maya", "Environmental History", "Archaeology", "Climate Change"],
    publicationDate: "2025-05-28",
    imageUrl: "images/maya-ruins.jpg",
    pdfUrl: "#",
    rating: 4.7,
    reviewCount: 10,
  },
  {
    id: 6,
    title: "Technological Innovation and Military Strategy in World War II",
    author: "James Williams",
    institution: "MIT",
    abstract:
      "This paper explores the critical relationship between technological advancements and military strategy during World War II. It focuses on radar, code-breaking, aircraft development, and nuclear technology as decisive factors in the Allied victory.",
    category: "modern",
    tags: ["World War II", "Military History", "Technology", "Strategy"],
    publicationDate: "2025-04-05",
    imageUrl: "images/ww2-tech.jpg",
    pdfUrl: "#",
    rating: 4.4,
    reviewCount: 9,
  },
];

// Functions for paper management

/**
 * Create HTML for a paper card
 * @param {Object} paper - Paper data object
 * @returns {string} - HTML string for the paper card
 */
function createPaperCard(paper) {
  return `
        <div class="paper-card" data-id="${paper.id}" data-category="${
    paper.category
  }">
            <div class="paper-image" style="background-image: url('${
              paper.imageUrl || "images/paper-default.jpg"
            }'); background-size: cover; background-position: center;">
                <span class="paper-category">${getCategoryName(
                  paper.category
                )}</span>
            </div>
            <div class="paper-details">
                <h3 class="paper-title">
                    <a href="paper-view.html?id=${paper.id}">${paper.title}</a>
                </h3>
                <p class="paper-author">By ${paper.author}, ${
    paper.institution
  }</p>
                <p class="paper-abstract">${truncateText(
                  paper.abstract,
                  150
                )}</p>
                <div class="paper-meta">
                    <span class="paper-date">${formatDate(
                      paper.publicationDate
                    )}</span>
                    <span class="paper-rating">
                        ${createStarRating(paper.rating)} (${paper.reviewCount})
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get category display name
 * @param {string} categoryKey - Category key
 * @returns {string} - Display name for category
 */
function getCategoryName(categoryKey) {
  const categories = {
    ancient: "Ancient History",
    medieval: "Medieval History",
    modern: "Modern History",
    us: "U.S. History",
    world: "World History",
    other: "Other",
  };

  return categories[categoryKey] || "General";
}

/**
 * Load recent papers on the homepage
 */
function loadRecentPapers() {
  const recentPapersContainer = document.getElementById(
    "recent-papers-container"
  );

  if (!recentPapersContainer) return;

  // Sort papers by date (newest first) and take the first 3
  const recentPapers = [...papersData]
    .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
    .slice(0, 3);

  if (recentPapers.length === 0) {
    recentPapersContainer.innerHTML = "<p>No recent papers available.</p>";
    return;
  }

  let papersHTML = "";
  recentPapers.forEach((paper) => {
    papersHTML += createPaperCard(paper);
  });

  recentPapersContainer.innerHTML = papersHTML;
}

/**
 * Load all papers on the submissions page with filtering and sorting
 */
function loadAllPapers() {
  const papersContainer = document.getElementById("papers-container");
  const papersCountElement = document.getElementById("papers-count");
  const searchInput = document.getElementById("search-papers");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");

  if (!papersContainer) return;

  // Function to filter and display papers
  function filterAndDisplayPapers() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = categorySelect.value;
    const sortOption = sortSelect.value;

    // Filter papers based on search term and category
    let filteredPapers = papersData.filter((paper) => {
      const matchesSearch =
        paper.title.toLowerCase().includes(searchTerm) ||
        paper.author.toLowerCase().includes(searchTerm);
      const matchesCategory =
        categoryFilter === "all" || paper.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort papers based on selected option
    filteredPapers = sortPapers(filteredPapers, sortOption);

    // Update papers count
    if (papersCountElement) {
      papersCountElement.textContent = filteredPapers.length;
    }

    // Display filtered papers
    if (filteredPapers.length === 0) {
      papersContainer.innerHTML =
        "<p>No papers match your search criteria.</p>";
      return;
    }

    let papersHTML = "";
    filteredPapers.forEach((paper) => {
      papersHTML += createPaperCard(paper);
    });

    papersContainer.innerHTML = papersHTML;
  }

  // Sort papers based on option
  function sortPapers(papers, sortOption) {
    switch (sortOption) {
      case "newest":
        return [...papers].sort(
          (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
        );
      case "oldest":
        return [...papers].sort(
          (a, b) => new Date(a.publicationDate) - new Date(b.publicationDate)
        );
      case "az":
        return [...papers].sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return [...papers].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return papers;
    }
  }

  // Add event listeners for filtering and sorting
  if (searchInput) {
    searchInput.addEventListener("input", filterAndDisplayPapers);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", filterAndDisplayPapers);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", filterAndDisplayPapers);
  }

  // Initial display
  filterAndDisplayPapers();
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadRecentPapers();
  loadAllPapers();
});
