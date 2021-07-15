import React, { Fragment } from "react";
import { Card, CardBody } from "reactstrap";

const MessageCard = ({ data }) => {
  return (
    <Fragment>
      <Card className="mb-3 float-left" style={{ width: "100%" }}>
        <div className="position-absolute  pt-1 pr-2 r-0">
          <span className="text-extra-small text-muted">{data.createDate}</span>
        </div>
        <CardBody className="pt-2 pb-2">
          <div className="d-flex flex-row pb-1">
            <img
              alt={data.username}
              width="30px"
              height="30px"
              src={data.photoURL ? data.photoURL : "/assets/img/nexusF-19.png"}
              className="avatar"
            />
            <div className=" d-flex flex-grow-1 min-width-zero">
              <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                <div className="min-width-zero">
                  <p className="mb-0 truncate list-item-heading">
                    {data.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-text-left">
            <p className="mb-0 text-semi-muted" dangerouslySetInnerHTML={{__html: data.comment}} ></p>
          </div>
        </CardBody>
      </Card>
      <div className="clearfix" />
    </Fragment>
  );
};

export default MessageCard;
