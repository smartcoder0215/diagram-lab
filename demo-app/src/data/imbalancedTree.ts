const imbalancedTreeThreeLevel = {
  label: "Company Departments",
  children: [
    {
      label: "Engineering",
      children: [
        { label: "Frontend Development" },
        { label: "Backend Development" },
        { label: "DevOps" },
      ],
    },
    { label: "Human Resources" }, // No children
    {
      label: "Marketing",
      children: [{ label: "Content Creation" }, { label: "Social Media" }],
    },
    { label: "Finance" }, // No children
  ],
};

export default imbalancedTreeThreeLevel;
