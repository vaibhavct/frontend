import { ActionBar, Banner, Card, CardText, Header, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ResponseEmployee = (props) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardText>
        <Header>{props?.location?.state === "success" ? t("Birth Registration Approved Success !!!") : t("Oops Something went Wrong!!!")}</Header>
        <Banner successful={props?.location?.state === "success"}></Banner>
        DOWNLOAD BR PDF
      </CardText>
      <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label="GO TO HOME" />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default ResponseEmployee;
