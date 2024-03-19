import { ActionBar, Banner, Card, CardText, SubmitBar, Header } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Response = (props) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardText>
        <Header>{props?.location?.state === "success" ? t("Birth Registration Approved Success !!!") : t("Oops Something went Wrong!!")}</Header>
      </CardText>
      <Banner successful={props?.location?.state === "success"}></Banner>
      <ActionBar>
        <Link to={"/digit-ui/citizen"}>
          <SubmitBar label="GO TO HOME" />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default Response;
