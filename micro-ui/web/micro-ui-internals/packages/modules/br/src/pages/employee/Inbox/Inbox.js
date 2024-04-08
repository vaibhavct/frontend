import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "./DesktopInbox";
import { useQuery } from "react-query";

const Digit = window?.Digit || {};
const config = {
  label: "ES_COMMON_INBOX",
  type: "inbox",
  apiDetails: {
    serviceName: "/inbox/v2/_search",
    requestParam: {},
    requestBody: {
      inbox: {
        processSearchCriteria: {
          businessService: ["PQM"],
          moduleName: "pqm",
          tenantId: "pg.citya",
        },
        moduleSearchCriteria: {
          plantCodes: ["PURI_FSTP"],
          tenantId: "pg.citya",
        },
        tenantId: "pg.citya",
      },
    },
    minParametersForSearchForm: 1,
    tableFormJsonPath: "requestBody.inbox",
    masterName: "commonUiConfig",
    moduleName: "birthRegistrationConfig",
    filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
    searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
  },
  sections: {
    search: {
      uiConfig: {
        headerStyle: null,
        type: "birth-registration-table-search",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 1,
        defaultValues: {
          testIds: "",
        },
        fields: [
          {
            label: "Baby's First Name",
            type: "text",
            isMandatory: false,
            disable: false,
            populators: {
              name: "testIds",
              error: "BR_PATTERN_ERR_MSG",
              validation: {
                pattern: {},
                minlength: 2,
              },
            },
          },
        ],
      },
      label: "",
      children: {},
      show: true,
    },
    links: {
      uiConfig: {
        links: [
          {
            text: "CREATE_BIRTH_REGISTRATION",
            url: "/employee/br/birth",
            roles: [],
          },
        ],
        label: "ES_COMMON_INBOX",
        logoIcon: {
          component: "PropertyHouse",
          customClass: "inbox-search-icon--projects",
        },
      },
      children: {},
      show: true,
    },
    filter: {
      uiConfig: {
        type: "filter",
        headerStyle: null,
        primaryLabel: "ES_COMMON_APPLY",
        minReqFields: 0,
        secondaryLabel: "",
        defaultValues: {
          createdFrom: "",
          createdTo: "",
        },
        fields: [
          {
            label: "STATUS",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "status",
              options: ["in-progress", "pending", "registered"],
            },
          },
        ],
      },
      label: "ES_COMMON_FILTERS",
      show: true,
    },
    searchResult: {
      label: "",
      uiConfig: {
        columns: [
          {
            label: "Baby's First Name",
            jsonPath: "babyFirstName",
            additionalCustomization: true,
          },
          {
            label: "Baby's Last Name",
            jsonPath: "babyLastName",
          },
          {
            label: "Place Of Birth",
            jsonPath: "placeOfBirth",
          },
          {
            label: "Hospital Name",
            jsonPath: "hospitalName",
          },
        ],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "items",
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
};

const Inbox = ({ tenants, parentRoute }) => {
  const { t } = useTranslation();
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = useState({
    eventStatus: [],
    range: {
      startDate: null,
      endDate: new Date(""),
      title: "",
    },
    ulb: tenants?.find((tenant) => tenant?.code === tenantId),
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const [data, setData] = useState([]);
  const { isLoading } = data;

  const brData = useQuery(["BR_SEARCH", tenantId, data], () => Digit.BRService.search(tenantId, data));

  console.log(brData?.data?.BirthRegistrationApplications);

  const getSearchFields = () => {
    return [
      {
        label: t("Baby's First Name"),
        name: "babyFirstName",
      },
      {
        label: t("Baby's Last Name"),
        name: "babyLastName",
      },
      {
        label: t("Place of Birth"),
        name: "placeOfBirth",
      },
      {
        label: t("Hospital's Name"),
        name: "hospitalName",
      },
    ];
  };

  const links = [
    {
      text: t("Create Birth-Registration"),
      link: "/digit-ui/employee/br/birth",
    },
  ];

  const onSearch = (params) => {
    let updatedParams = { ...params };
    if (!params?.ulb) {
      updatedParams = { ...params, ulb: { code: tenantId } };
    }
    setSearchParams({ ...searchParams, ...updatedParams });
  };

  const handleFilterChange = (data) => {
    setSearchParams({ ...searchParams, ...data });
  };

  const globalSearch = (rows, columnIds) => {
    // return rows;
    return rows?.filter(
      (row) =>
        (searchParams?.babyLastName ? row.original?.babyLastName?.toUpperCase().startsWith(searchParams?.babyLastName.toUpperCase()) : true) &&
        (searchParams?.babyFirstName ? row.original?.babyFirstName?.toUpperCase().startsWith(searchParams?.babyFirstName?.toUpperCase()) : true) &&
        (searchParams?.placeOfBirth ? row.original?.placeOfBirth?.toUpperCase().startsWith(searchParams?.placeOfBirth?.toUpperCase()) : true) &&
        (searchParams?.hospitalName ? row.original?.hospitalName?.toUpperCase().startsWith(searchParams?.hospitalName?.toUpperCase()) : true)
    );
  };

  const fetchNextPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => parseInt(prevPageOffSet) + parseInt(pageSize));
  }, [pageSize]);

  const fetchPrevPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => parseInt(prevPageOffSet) - parseInt(pageSize));
  }, [pageSize]);

  const handlePageSizeChange = (e) => {
    setPageSize((prevPageSize) => e.target.value);
  };

  if (isLoading) {
    return <Loader />;
  }
  const mockData = [
    { id: 0, babyFirstName: "Ganesh", babyLastName: "Agarwal", hospitalName: "KokilaBen Speciality Hospital", placeOfBirth: "Jamnagar" },
    { id: 1, babyFirstName: "Kartikey", babyLastName: "Deshpande", hospitalName: "Sharada Speciality Hospital", placeOfBirth: "Pune" },
    { id: 2, babyFirstName: "Ayappan", babyLastName: "Reddy", hospitalName: "Government Speciality Hospital", placeOfBirth: "Jamnagar" },
  ];
  return (
    <React.Fragment>
      <div>
        <Header>{t("Birth-registration")}</Header>
        <p>{}</p>
        <div className="inbox-search-wrapper">
          <InboxSearchComposer configs={config}></InboxSearchComposer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Inbox;
