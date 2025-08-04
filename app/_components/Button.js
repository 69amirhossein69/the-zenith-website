"use client";

export default function Button({
  handleFilter,
  filter,
  children,
  activeFilter,
}) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`px-5 py-2 cursor-pointer hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
    >
      {children}
    </button>
  );
}
