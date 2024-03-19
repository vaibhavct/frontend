import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../../../components/config/config";
import { Link } from "react-router-dom";
import { SubmitBar } from "@egovernments/digit-ui-react-components";
const Create = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const defaultLandingUrl = useMemo(() => {
    if (window.location.pathname.split("/").includes("employee")) return "employee";
    if (window.location.pathname.split("/").includes("citizen")) return "citizen";
    return "employee";
  }, []);

  const onSubmit = (data) => {
    let roles = data?.Jurisdictions?.map((ele) => {
      return ele.roles?.map((item) => {
        item["tenantId"] = ele.boundary;
        return item;
      });
    });

    const mappedroles = [].concat.apply([], roles);
    let Users = {
      BirthRegistrationApplications: [
        {
          babyFirstName: data?.BrSelectName?.babyFirstName,
          babyLastName: data?.BrSelectName?.babyLastName,
          doctorName: data?.BrSelectName?.doctorName,
          hospitalName: data?.BrSelectName?.hospitalName,
          placeOfBirth: data?.BrSelectName?.placeOfBirth,
          gender: data?.BRSelectGender?.gender,
          tenantId: tenantId,
          address: {
            tenantId: tenantId,
            locality: {},
          },
          fatherOfApplicant: {
            tenantId: tenantId,
            name: data?.BrSelectFather?.name,
            userName: "91300114",
            mobileNumber: "9230011254",
            emailId: data?.BRSelectEmailId?.emailId,
            permanentAddress: data?.BrSelectAddress?.permanentAddress,
            permanentCity: data?.BrSelectAddress?.permanentCity,
            roles: mappedroles,
          },
          motherOfApplicant: {
            tenantId: tenantId,
            name: data?.BrSelectMother?.name,
            userName: "92300114",
            mobileNumber: "9230051254",
            roles: mappedroles,
          },
          workflow: {
            action: "APPLY",
            assignes: [],
            verificationDocuments: [
              {
                additionalDetails: {},
              },
            ],
          },
        },
      ],
    };

    Digit.BRService.create(Users, tenantId)
      .then((result, err) => {
        let getdata = { ...data, get: result };
        console.log(getdata);
        history.push(`/digit-ui/${defaultLandingUrl}/br/response`, "success");
      })
      .catch((err) => {
        console.log(err);
        history.push(`/digit-ui/${defaultLandingUrl}/br/response`, "error");
      });
  };

  const configs = newConfig ? newConfig : newConfig;

  return (
    <div className="employee-card-wrapper">
      <div className="header-content" style={{display:"flex", justifyContent:"space-between"}}>
        <Header>{t("Create Birth Registration")}</Header>
        <Link to={`/digit-ui/${defaultLandingUrl}`}>
          <SubmitBar label="GO TO HOME" />
        </Link>
      </div>
      <FormComposerV2
        label={t("Submit")}
        config={configs.map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 0 }}
      />
    </div>
  );
};

export default Create;
