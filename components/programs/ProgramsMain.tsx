"use client";
import React from "react";
import SearchBar from "./SearchBar";
import ProgramList from "./ProgramList";

const ProgramsMain = ({ programs }: any) => {
  return (
    <div>
      {" "}
      <SearchBar
        onSearch={(query) => console.log(query)}
        onFilter={() => {}}
        initialFilters={{}}
      />
      <ProgramList programs={programs} />
    </div>
  );
};

export default ProgramsMain;
