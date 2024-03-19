import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker } from "@egovernments/digit-ui-react-components";
import DropdownUlb from "./DropdownUlb";
import { alphabeticalSortFunctionForTenantsBasedOnName } from "../../../utils";

const Search = ({ onSearch, searchParams, searchFields, type, onClose, isInboxPage, t }) => {
  const { register, handleSubmit, formState, reset, watch, control } = useForm({
    defaultValues: searchParams,
  });
  const mobileView = innerWidth <= 640;
  const ulb = Digit.SessionStorage.get("BR_TENANTS");
  console.log("geee", ulb);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const userInfo = Digit.UserService.getUser().info;
  console.log("geeeinfo", userInfo);
  const userUlbs = ulb
    .filter((ulb) => userInfo?.roles?.some((role) => role?.tenantId === ulb?.code))
    .sort(alphabeticalSortFunctionForTenantsBasedOnName);

  const getFields = (input) => {
    switch (input.type) {
      case "ulb":
        return (
          <Controller
            rules={{ required: true }}
            render={(props) => <DropdownUlb onAssignmentChange={props.onChange} value={props.value} ulb={userUlbs} t={t} />}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        );
      default:
        return (
          <Controller
            render={(props) => <TextInput onChange={props.onChange} value={props.value} />}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        );
    }
  };

  const onSubmitInput = (data) => {
    onSearch(data);
    if (type === "mobile") {
      onClose();
    }
  };

  const clearSearch = () => {
    reset({ ulb: null, placeOfBirth: "", hospitalName: "", babyLastName: "", babyFirstName: "" });
    onSearch({ ulb: null, placeOfBirth: "", hospitalName: "", babyLastName: "", babyFirstName: "" });
  };

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
          ...mobileViewStyles,
        }}
        onClick={clearSearch}
      >
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <div className="search-container" style={{ width: "auto", marginLeft: isInboxPage ? "24px" : "revert" }}>
        <div className="search-complaint-container">
          {(type === "mobile" || mobileView) && (
            <div className="complaint-header">
              <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
              <span onClick={onClose}>
                <CloseSvg />
              </span>
            </div>
          )}
          <div
            className={"complaint-input-container for-pt " + (!isInboxPage ? "for-search" : "")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}
          >
            {searchFields?.map((input, index) => (
              <div
                key={input.name}
                className="input-fields"
                style={{
                  width: `${100 / searchFields?.length + 1}%`,
                }}
              >
                <span className={"mobile-input"}>
                  <Label>{t(input.label) + ` ${input.isMendatory ? "*" : ""}`}</Label>
                  {getFields(input)}
                </span>
                {formState?.dirtyFields?.[input.name] ? (
                  <span
                    style={{ fontWeight: "700", color: "rgba(212, 53, 28)", paddingLeft: "8px", marginTop: "-20px", fontSize: "12px" }}
                    className="inbox-search-form-error"
                  >
                    {formState?.errors?.[input.name]?.message}
                  </span>
                ) : null}
              </div>
            ))}

            {type === "desktop" && !mobileView && (
              <div
                style={{
                  maxWidth: "unset",
                  marginLeft: "unset",
                  marginTop: "60px",
                  display: "flex",
                  width: `${100 / searchFields?.length + 1}%`,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
                className="search-submit-wrapper"
              >
                <SubmitBar className="submit-bar-search" label={t("ES_COMMON_SEARCH")} submit />
                <div style={{ width: "70%", border: "1px solid #f47738", height: "40px" }}>{clearAll()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {(type === "mobile" || mobileView) && (
        <ActionBar className="clear-search-container">
          <button className="clear-search" style={{ flex: 1 }}>
            {clearAll(mobileView)}
          </button>
          <SubmitBar disabled={!!Object.keys(formState.errors).length} label={t("ES_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
        </ActionBar>
      )}
    </form>
  );
};

export default Search;
