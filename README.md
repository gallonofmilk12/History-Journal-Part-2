# Student History Journal Website

A responsive website for a student-run history journal where students can submit their research papers for peer review and publication. The platform allows students to browse published papers, read them online, download PDFs, and participate in the peer review process.

## Design

The website features an old newspaper-inspired design:

- Vintage typography with serif and typewriter fonts (Playfair Display, Source Serif Pro, Special Elite)
- Paper texture background and ink-colored text
- Decorative elements like date lines, stamps, and page numbers
- Double borders and dividers common in historical newspapers
- "EXTRA" banners and newspaper-style headings
- Column-based layout in many sections

## Features

### Home Page

- Featured/recent publications
- Introduction to the journal's mission
- Quick access to paper browsing and submission

### About & Rules Page

- Journal objectives and mission statement
- Submission guidelines and formatting requirements
- Peer review process explanation
- Ethical guidelines

### Submissions Page

- Browse all published papers
- Filter by category and search functionality
- Sort by date, title, etc.
- Responsive paper cards with abstracts

### Paper View Page

- Full paper content with proper formatting
- Paper metadata (author, date, category, etc.)
- Citation tools
- Peer reviews and comments section
- Related papers suggestions

### Paper Submission Page

- User-friendly submission form
- Author information collection
- Paper metadata input
- File upload (PDF)
- Draft saving functionality

## Technology Stack

- HTML5 for structure
- CSS3 for styling (with responsive design)
- Vanilla JavaScript for interactivity
- Local Storage for saving form drafts

## Project Structure

```
student-history-journal/
│
├── index.html                  # Home page
├── about.html                  # About & rules page
├── submissions.html            # Paper browsing page
├── paper-view.html             # Individual paper view
├── submit-paper.html           # Paper submission form
│
├── css/
│   └── styles.css              # Main stylesheet
│
├── js/
│   ├── main.js                 # Common functionality
│   ├── papers.js               # Paper data and display functions
│   ├── paper-view.js           # Individual paper view functions
│   └── submit-paper.js         # Submission form functionality
│
└── images/                     # Image assets
    └── paper-default.jpg       # Default paper thumbnail
```

## Setup and Usage

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Navigate through the site using the navigation menu

## Future Enhancements

- Backend integration with a database
- User authentication system
- Admin panel for paper management
- Email notifications for submission status
- Online paper editor with formatting tools
- Enhanced search with filters
- Commenting and discussion system
- Social sharing functionality

## License

This project is available for educational purposes.

## Credits

- Font Awesome for icons
- Google Fonts for typography:
  - Playfair Display (headlines and titles)
  - Source Serif Pro (body text)
  - Special Elite (accent and stamps)
- Paper texture background for the newspaper effect
- Sample data is fictional and for demonstration purposes only
