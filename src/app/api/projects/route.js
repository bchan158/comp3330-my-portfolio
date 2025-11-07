// GET /api/projects
export async function GET() {
  //   const projects = [
  //     {
  //       title: "Conway's Game of Life",
  //       description: "Cellular automaton visualizer.",
  //       image: "/images/placeholder-300x300.png",
  //       link: "https://example.com/game-of-life",
  //       keywords: ["algorithms", "simulation"],
  //     },
  //     // ...add more seed items
  //   ];

  const projects = [
    {
      title: "Project One",
      desc: "This is project 1",
      img: "https://placehold.co/300.png",
      link: "https://your-project-link.com",
      keywords: [],
    },
    {
      title: "Project Two",
      desc: "This is project 2",
      img: "https://placehold.co/300.png",
      link: "https://your-project-link.com",
      keywords: [],
    },
    {
      title: "Project Three",
      desc: "This is project 3",
      img: "https://placehold.co/300.png",
      link: "https://your-project-link.com",
      keywords: [],
    },
  ];

  return Response.json({ projects });
}
