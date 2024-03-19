import { PersonIcon, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const BRCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PersonIcon />,
    moduleName: t("Birth Registration"),
    links: [
      {
        label: t("Inbox"),
        link: `/digit-ui/employee/br/Inbox`,
      },
      {
        label: t("Registration"),
        link: `/digit-ui/employee/br/birth`,
      },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BRCard;
