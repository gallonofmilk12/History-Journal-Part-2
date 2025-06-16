// JavaScript for the paper view page

document.addEventListener("DOMContentLoaded", () => {
  // Get paper ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const paperId = parseInt(urlParams.get("id"));

  if (!paperId) {
    // No paper ID provided, redirect to submissions page
    window.location.href = "submissions.html";
    return;
  }

  // Find the paper in our data
  const paper = papersData.find((p) => p.id === paperId);

  if (!paper) {
    // Paper not found, show error message
    const paperView = document.getElementById("paper-view");
    if (paperView) {
      paperView.innerHTML = `
                <div class="container">
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Paper not found. <a href="submissions.html">Return to all submissions</a>.</p>
                    </div>
                </div>
            `;
    }
    return;
  }

  // Load paper metadata
  loadPaperMetadata(paper);

  // Load paper content (in a real app, this would fetch from a server)
  loadPaperContent(paper);

  // Load paper citations
  loadPaperCitations(paper);

  // Load comments/reviews
  loadPaperComments(paper);

  // Load related papers
  loadRelatedPapers(paper);

  // Setup comment form
  setupCommentForm(paper);
});

/**
 * Load paper metadata into the page
 * @param {Object} paper - Paper data
 */
function loadPaperMetadata(paper) {
  const paperMetaElement = document.getElementById("paper-meta");

  if (!paperMetaElement) return;

  // Format the tags for display
  let tagsHTML = "";
  if (paper.tags && paper.tags.length > 0) {
    paper.tags.forEach((tag) => {
      tagsHTML += `<span class="tag">${tag}</span>`;
    });
  }

  paperMetaElement.innerHTML = `
        <h1>${paper.title}</h1>
        <div class="paper-meta-details">
            <div class="meta-item">
                <i class="fas fa-user"></i>
                <span>${paper.author}, ${paper.institution}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Published on ${formatDate(paper.publicationDate)}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-folder"></i>
                <span>${getCategoryName(paper.category)}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-star"></i>
                <span>${paper.rating} (${paper.reviewCount} reviews)</span>
            </div>
        </div>
        <div class="paper-tags">
            ${tagsHTML}
        </div>
        <div class="paper-actions" style="margin-top: 20px;">
            <a href="${paper.pdfUrl}" class="btn primary" target="_blank">
                <i class="fas fa-download"></i> Download PDF
            </a>
            <button class="btn secondary" id="cite-paper">
                <i class="fas fa-quote-right"></i> Cite This Paper
            </button>
        </div>
    `;

  // Add event listener for citation button
  const citeButton = document.getElementById("cite-paper");
  if (citeButton) {
    citeButton.addEventListener("click", () => {
      // Create citation formats popup
      const citationHTML = `
                <div class="citation-popup">
                    <h4>Citation Formats</h4>
                    <div class="citation-format">
                        <h5>MLA</h5>
                        <p>${paper.author.split(" ")[1]}, ${
        paper.author.split(" ")[0]
      }. "${paper.title}." <em>Student History Journal</em>, ${new Date(
        paper.publicationDate
      ).getFullYear()}.</p>
                        <button class="copy-btn" data-citation="mla"><i class="fas fa-copy"></i> Copy</button>
                    </div>
                    <div class="citation-format">
                        <h5>APA</h5>
                        <p>${paper.author.split(" ")[1]}, ${paper.author
        .split(" ")[0]
        .charAt(0)}. (${new Date(paper.publicationDate).getFullYear()}). ${
        paper.title
      }. <em>Student History Journal</em>.</p>
                        <button class="copy-btn" data-citation="apa"><i class="fas fa-copy"></i> Copy</button>
                    </div>
                    <div class="citation-format">
                        <h5>Chicago</h5>
                        <p>${paper.author.split(" ")[1]}, ${
        paper.author.split(" ")[0]
      }. "${paper.title}." <em>Student History Journal</em> (${new Date(
        paper.publicationDate
      ).getFullYear()}).</p>
                        <button class="copy-btn" data-citation="chicago"><i class="fas fa-copy"></i> Copy</button>
                    </div>
                </div>
            `;

      // Create modal overlay
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    ${citationHTML}
                </div>
            `;

      // Add modal styles
      overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            `;

      document.body.appendChild(overlay);

      // Add styles to the modal content
      const modalContent = overlay.querySelector(".modal-content");
      modalContent.style.cssText = `
                background-color: white;
                padding: 30px;
                border-radius: 6px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            `;

      // Close modal event
      const closeModal = overlay.querySelector(".close-modal");
      closeModal.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
            `;

      closeModal.addEventListener("click", () => {
        document.body.removeChild(overlay);
      });

      // Citation format styles
      const citationFormats = overlay.querySelectorAll(".citation-format");
      citationFormats.forEach((format) => {
        format.style.cssText = `
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                `;
      });

      // Copy button functionality
      const copyButtons = overlay.querySelectorAll(".copy-btn");
      copyButtons.forEach((button) => {
        button.style.cssText = `
                    background-color: var(--secondary-color);
                    color: var(--dark-color);
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                `;

        button.addEventListener("click", (e) => {
          const citationType = e.target.closest(".copy-btn").dataset.citation;
          const citationText = e.target
            .closest(".citation-format")
            .querySelector("p").textContent;

          navigator.clipboard
            .writeText(citationText)
            .then(() => {
              button.innerHTML = '<i class="fas fa-check"></i> Copied!';
              setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> Copy';
              }, 2000);
            })
            .catch((err) => {
              console.error("Failed to copy citation: ", err);
            });
        });
      });
    });
  }
}

/**
 * Load paper content
 * @param {Object} paper - Paper data
 */
function loadPaperContent(paper) {
  const paperContentElement = document.getElementById("paper-content");

  if (!paperContentElement) return;

  // In a real app, you would fetch the full content from a server
  // For this demo, we'll generate some placeholder content based on the paper's abstract

  paperContentElement.innerHTML = `
        <h2>Abstract</h2>
        <p>${paper.abstract}</p>
        
        <h2>Introduction</h2>
        <p>This paper explores ${paper.title.toLowerCase()}. The topic is significant because it offers new insights into historical developments that have shaped our understanding of ${paper.tags[0].toLowerCase()}.</p>
        <p>Previous research has established important groundwork in this area, but gaps remain in our understanding of the complex interplay between various historical factors. This study aims to fill those gaps by examining primary sources and applying a novel analytical framework.</p>
        
        <h2>Methodology</h2>
        <p>This research employs a mixed-methods approach combining archival research, quantitative analysis of historical data, and comparative case studies. Primary sources were collected from various archives including the National Archives, university collections, and digital repositories.</p>
        <p>The analytical framework draws from both historical methodologies and interdisciplinary approaches incorporating elements from economics, sociology, and political science where relevant to the interpretation of findings.</p>
        
        <h2>Analysis and Findings</h2>
        <p>The analysis reveals several key patterns that contribute to our understanding of ${
          paper.tags[1]
        }. First, the evidence suggests that conventional interpretations have overlooked important contextual factors that influenced historical developments.</p>
        <p>Second, the comparative analysis demonstrates significant regional variations that challenge generalized narratives about this historical period. These variations can be attributed to differences in local governance structures, economic conditions, and cultural practices.</p>
        <p>Third, quantitative data indicates trends that correlate with broader historical shifts, providing a more nuanced understanding of cause-and-effect relationships.</p>
        
        <h2>Discussion</h2>
        <p>The findings of this study have several implications for our understanding of ${
          paper.category
        } history. They challenge certain established narratives while reinforcing others with stronger evidential support.</p>
        <p>The research also highlights the importance of considering multiple perspectives and sources when interpreting historical events, particularly those that have been subject to ideological framing in traditional historiography.</p>
        
        <h2>Conclusion</h2>
        <p>This paper has demonstrated the value of revisiting historical topics with fresh analytical approaches and a broader range of source materials. Future research could expand upon these findings by exploring additional regional contexts or by applying the analytical framework to related historical questions.</p>
        <p>By continuing to challenge and refine our understanding of the past, we contribute not only to historical scholarship but also to our ability to contextualize contemporary issues that have deep historical roots.</p>
    `;
}

/**
 * Load paper citations
 * @param {Object} paper - Paper data
 */
function loadPaperCitations(paper) {
  const paperCitationsElement = document.getElementById("paper-citations");

  if (!paperCitationsElement) return;

  // Generate some sample citations based on paper tags
  const citations = [
    `Anderson, J. (2023). Understanding the Foundations of ${paper.tags[0]}. <em>Historical Review</em>, 45(2), 112-134.`,
    `Brown, S., & Davis, M. (2022). A Comparative Analysis of ${paper.tags[1]} Across Different Time Periods. <em>Journal of Historical Studies</em>, 78(3), 289-305.`,
    `Clark, R. (2024). New Perspectives on ${paper.category} History. Oxford University Press.`,
    `Donnelly, E., & Thompson, P. (2023). The Evolution of Historical Methodology in ${paper.tags[0]} Research. <em>Historiography Quarterly</em>, 15(1), 67-89.`,
    `Evans, F. (2021). Primary Sources and Their Interpretation in ${paper.tags[1]} Studies. Cambridge University Press.`,
  ];

  paperCitationsElement.innerHTML = `
        <h2>References</h2>
        <div class="citations-list">
            ${citations
              .map((citation) => `<p class="citation">${citation}</p>`)
              .join("")}
        </div>
    `;
}

/**
 * Load paper comments/reviews
 * @param {Object} paper - Paper data
 */
function loadPaperComments(paper) {
  const commentsContainer = document.getElementById("comments-container");

  if (!commentsContainer) return;

  // Generate sample comments
  const comments = [
    {
      author: "Dr. Sarah Williams",
      institution: "University of Edinburgh",
      date: "2025-06-01",
      rating: 5,
      text: "An excellent contribution to the field. The author presents a well-researched analysis with strong evidence to support their claims. The methodology is sound and the conclusions are well-justified. I particularly appreciated the integration of diverse primary sources.",
    },
    {
      author: "Prof. Daniel Lee",
      institution: "Yale University",
      date: "2025-05-28",
      rating: 4,
      text: "This paper offers valuable insights into an important historical topic. The analysis is generally strong, though I would suggest expanding the discussion of regional variations in Section 3. The author's interpretation of primary sources is thoughtful and contextually appropriate.",
    },
    {
      author: "Dr. Rebecca Martinez",
      institution: "University of Toronto",
      date: "2025-05-25",
      rating: 5,
      text: "A thoroughly researched and well-argued paper that makes a significant contribution to our understanding of this historical period. The comparative approach is particularly effective, and the author skillfully navigates complex historiographical debates. Highly recommended for those interested in this field.",
    },
  ];

  if (comments.length === 0) {
    commentsContainer.innerHTML =
      "<p>No reviews yet. Be the first to review this paper!</p>";
    return;
  }

  let commentsHTML = "";
  comments.forEach((comment) => {
    commentsHTML += `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}, ${
      comment.institution
    }</span>
                    <span class="comment-date">${formatDate(
                      comment.date
                    )}</span>
                </div>
                <div class="comment-rating">
                    ${createStarRating(comment.rating)}
                </div>
                <div class="comment-content">
                    <p>${comment.text}</p>
                </div>
            </div>
        `;
  });

  commentsContainer.innerHTML = commentsHTML;
}

/**
 * Load related papers
 * @param {Object} paper - Paper data object
 */
function loadRelatedPapers(paper) {
  const relatedPapersContainer = document.getElementById(
    "related-papers-container"
  );

  if (!relatedPapersContainer) return;

  // Find related papers (same category or matching tags)
  const relatedPapers = papersData
    .filter((p) => {
      if (p.id === paper.id) return false; // Skip the current paper

      // Check for same category or shared tags
      const sameCategory = p.category === paper.category;

      let sharedTags = 0;
      if (paper.tags && p.tags) {
        paper.tags.forEach((tag) => {
          if (p.tags.includes(tag)) sharedTags++;
        });
      }

      return sameCategory || sharedTags > 0;
    })
    .slice(0, 3); // Limit to 3 related papers

  if (relatedPapers.length === 0) {
    relatedPapersContainer.innerHTML = "<p>No related papers found.</p>";
    return;
  }

  let papersHTML = "";
  relatedPapers.forEach((relatedPaper) => {
    papersHTML += createPaperCard(relatedPaper);
  });

  relatedPapersContainer.innerHTML = papersHTML;
}

/**
 * Setup the comment form
 * @param {Object} paper - Paper data
 */
function setupCommentForm(paper) {
  const commentForm = document.getElementById("comment-form");

  if (!commentForm) return;

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const reviewerName = document.getElementById("reviewer-name").value;
    const reviewerEmail = document.getElementById("reviewer-email").value;
    const reviewRating = document.getElementById("review-rating").value;
    const reviewText = document.getElementById("review-text").value;

    // In a real app, you would send this data to your server
    // For this demo, we'll just show a success message

    const addCommentSection = document.getElementById("add-comment");
    if (addCommentSection) {
      addCommentSection.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for your review! It has been submitted for moderation and will appear once approved.</p>
                </div>
            `;
    }
  });
}
