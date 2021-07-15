import React, { Component } from "react";
import { connect } from "react-redux";
import { NavItem, } from "reactstrap";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

import IntlMessages from "../../helpers/IntlMessages";
import ApplicationMenu from "../../components/common/ApplicationMenu";
import { getIdeaListWithFilter } from "../../redux/actions";
class TodoApplicationMenu extends Component {
  constructor(props) {
    super();
  }

  addFilter = (column, value) => {
    this.props.getIdeaListWithFilter(column, value);
  };

  render() {
    const { ideaItems, filter, allIdeaItems, loading } = this.props.ideaApp;

    return (
      <ApplicationMenu>asdfasdfsadf
        <PerfectScrollbar
          options={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <div className="p-4">
            <p className="text-muted text-small">
              Status
            </p>
            <ul className="list-unstyled mb-5">
              <NavItem className={classnames({ active: !filter })}>
                <NavLink
                  to="#"
                  onClick={e => this.addFilter("", "")}
                  location={{}}
                >
                  <i className="simple-icon-reload" />
                  All Ideas
                  <span className="float-right">
                    {loading && allIdeaItems.length}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                className={classnames({
                  active:
                    filter &&
                    filter.column === "status" &&
                    filter.value === "PENDING"
                })}
              >
                <NavLink
                  location={{}}
                  to="#"
                  onClick={e => this.addFilter("status", "PENDING")}
                >
                  <i className="simple-icon-refresh" />
                  Pending Ideas
                  <span className="float-right">
                    {loading &&
                      ideaItems.filter(x => x.status === "PENDING").length}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                className={classnames({
                  active:
                    filter &&
                    filter.column === "status" &&
                    filter.value === "COMPLETED"
                })}
              >
                <NavLink
                  to="#"
                  location={{}}
                  onClick={e => this.addFilter("status", "COMPLETED")}
                >
                  <i className="simple-icon-check" />
                  Completed ideas
                  <span className="float-right">
                    {loading &&
                      ideaItems.filter(x => x.status === "COMPLETED").length}
                  </span>
                </NavLink>
              </NavItem>
            </ul>
          </div>
        </PerfectScrollbar>
      </ApplicationMenu>
    );
  }
}

const mapStateToProps = ({ ideaApp }) => {
  return {
    ideaApp
  };
};
export default connect(mapStateToProps, {
  getIdeaListWithFilter
})(TodoApplicationMenu);
