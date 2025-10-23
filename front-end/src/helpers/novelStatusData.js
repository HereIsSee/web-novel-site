export const novelStatusData = [
  {
    id: 0,
    name: "All",
    description:
      "Show all fictions matching the other search parameters regardless of status. Note: This overrides all other selected statuses",
  },
  {
    id: 1,
    name: "Completed",
    description: "Show fictions that have been completed",
  },
  {
    id: 2,
    name: "Dropped",
    description: "Show fictions that have been marked as dropped by the author",
  },
  {
    id: 3,
    name: "Ongoing",
    description:
      "Show fictions that have not been completed yet, but the author is still known to release chapters",
  },
  {
    id: 4,
    name: "Hiatus",
    description:
      "Show fictions whose author haven't posted in at least half a year, and are not marked as completed",
  },
  {
    id: 5,
    name: "Inactive",
    description:
      "Show fictions that the author or the staff marked as incomplete, often because of content getting removed due to licensing",
  },
];
