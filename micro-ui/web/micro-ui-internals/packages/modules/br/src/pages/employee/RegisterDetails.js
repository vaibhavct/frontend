import {
    Header,
    Card,
    CardSectionHeader,
    PDFSvg,
    Loader,
    StatusTable,
    Menu,
    ActionBar,
    SubmitBar,
    Modal,
    CardText,
  } from "@egovernments/digit-ui-react-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import { useParams, useHistory } from "react-router-dom";
  
  const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
  };
  
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
  
  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };
  
  const RegisterDetails = ({ location, match }) => {
    const { id } = useParams();
    const { t } = useTranslation();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
    const tenantId = Digit.ULBService.getCurrentTenantId();
  
    const { isLoading, data } = Digit.Hooks.br.useBRSearch(tenantId, { ids: id });
  
    let isMobile = window.Digit.Utils.browser.isMobile();
  
    function onActionSelect(action) {
      // setSelectedAction(action);
      if (action === "Approve") {
        history.push(`/digit-ui/employee/br/responseemp`);
      }
      if (action === "Reject") {
        setShowModal(true);
      }
      setDisplayMenu(false);
    }
  
    const handleDelete = () => {
      const details = {
        events: [
          {
            ...data?.applicationData,
            status: "CANCELLED",
          },
        ],
      };
      history.push(`/digit-ui/employee`);
    };
  
    return (
      <div>
        <Header>{t(`Birth-Registration Details`)}</Header>
        <div className="notice_and_circular_main gap-ten">
          <div className="documentDetails_wrapper">
            <div className="documentDetails_row_items">
              <p className="documentDetails_title">{`${t("Baby First Name")}:`}</p>{" "}
              <p>{data?.BirthRegistrationApplications?.filter((na) => na.id === id)?.[0].babyFirstName}</p>{" "}
            </div>
            <div className="documentDetails_row_items">
              <p className="documentDetails_title">{`${t("Baby Last Name")}:`}</p>{" "}
              <p>{t(data?.BirthRegistrationApplications?.filter((na) => na.id === id)?.[0].babyLastName)}</p>{" "}
            </div>
  
            <div className="documentDetails_row_items">
              <p className="documentDetails_title">{`${t("Doctor Name")}:`}</p>{" "}
              <p>{t(data?.BirthRegistrationApplications?.filter((na) => na.id === id)?.[0].doctorName)}</p>{" "}
            </div>
            <div className="documentDetails_row_items">
              <p className="documentDetails_title">{`${t("Hospital Name")}:`}</p>{" "}
              <p>{t(data?.BirthRegistrationApplications?.filter((na) => na.id === id)?.[0].hospitalName)}</p>{" "}
            </div>
  
            <div className="documentDetails_row_items">
              <p className="documentDetails_title">{`${t("Place Of Birth")}:`}</p>{" "}
              <p>{t(data?.BirthRegistrationApplications?.filter((na) => na.id === id)?.[0].placeOfBirth)}</p>{" "}
            </div>
          </div>
        </div>
        <ActionBar>
          {displayMenu ? <Menu localeKeyPrefix={"BR"} options={["Approve", "Reject"]} t={t} onSelect={onActionSelect} /> : null}
          <SubmitBar label={t("Take Action")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
        {showModal && (
          <Modal
            headerBarMain={<Heading label={t("Confirm Reject Application")} />}
            headerBarEnd={<CloseBtn onClick={() => setShowModal(false)} />}
            actionCancelLabel={t("Cancel")}
            actionCancelOnSubmit={() => setShowModal(false)}
            actionSaveLabel={t("Reject")}
            actionSaveOnSubmit={handleDelete}
          >
            <Card style={{ boxShadow: "none" }}>
              <CardText>{t(`Reject Application due to invalid information`)}</CardText>
            </Card>
          </Modal>
        )}
      </div>
    );
  };
  
  export default RegisterDetails;