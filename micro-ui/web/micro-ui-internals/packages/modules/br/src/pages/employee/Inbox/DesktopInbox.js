import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";
import ApplicationTable from "./ApplicationTable";
import EventLink from "./EventLink";
import Search from "./Search";
import Filter from "./Filter";
import { ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";

const DesktopInbox = ({
  isLoading,
  data,
  t,
  onSearch,
  parentRoute,
  title,
  iconName,
  links,
  globalSearch,
  searchFields,
  searchParams,
  onFilterChange,
  pageSizeLimit,
  totalRecords,
  currentPage,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
}) => {
  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Baby's First Name"),
        accessor: "babyFirstName",
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`details/${row.original.id}`}>{row.original["babyFirstName"]}</Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: "Baby's Last Name",
        accessor: "babyLastName",
      },

      {
        Header: "Place Of Birth",
        accessor: "placeOfBirth",
      },
      {
        Header: "Hospital Name",
        accessor: "hospitalName",
      },
    ];
  }, [t]);

  let result;

  if (isLoading) {
    result = <Loader />;
  } else if (data?.length > 0) {
    result = (
      <ApplicationTable
        t={t}
        data={data}
        columns={columns}
        globalSearch={globalSearch}
        onSearch={searchParams}
        pageSizeLimit={pageSizeLimit}
        totalRecords={totalRecords}
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onPageSizeChange={onPageSizeChange}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("Inbox Application No.") ? "240px" : "",
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
      />
    );
  } else {
    result = (
      <ApplicationTable
        t={t}
        data={[]}
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("Inbox Application No.") ? "240px" : "",
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
      />
    );
  }

  return (
    <div className="inbox-container">
      <div className="filters-container">
        <EventLink title={"Birth-registration"} icon={iconName} links={links} />
        <div>
          <Filter onFilterChange={onFilterChange} searchParams={searchParams} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Search t={t} onSearch={onSearch} type="desktop" searchFields={searchFields} isInboxPage={true} searchParams={searchParams} />

        <div className="result" style={{ marginLeft: "24px", flex: 1 }}>
          {result}
        </div>
      </div>
      <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label="GO TO HOME" />
        </Link>
      </ActionBar>
    </div>
  );
};

export default DesktopInbox;
