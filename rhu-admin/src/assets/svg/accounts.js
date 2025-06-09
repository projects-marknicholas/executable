import React from "react";
import { Link } from "react-router-dom";

// Assets
import ProfileImage from "../../../assets/svg/profile.svg";
import AcceptSvg from "../../../assets/svg/accept.svg";
import DeclineSvg from "../../../assets/svg/decline.svg";

// CSS
import '../../../../assets/css/table.css';

const TableAccounts = () => {
  return (
    <div className="table-holder">
      <div className="table-header">
        <div className="table-btns">
          <Link to="/admin/active-accounts">Active accounts</Link>
        </div>
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            id="search"
            name="search"
            autoComplete="off"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="table-scrolling">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Student number</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src={ProfileImage} alt="Profile" />
              </td>
              <td>123456</td>
              <td>John Doe</td>
              <td>johndoe@example.com</td>
              <td>
                <select>
                  <option>Select a role</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="dean">Dean</option>
                  <option value="adviser">Adviser</option>
                </select>
              </td>
              <td className="action-field">
                <button className="accept">
                  <img src={AcceptSvg} alt="Accept" /> Accept
                </button>
                <button className="decline">
                  <img src={DeclineSvg} alt="Decline" /> Decline
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="item">
          <p>Showing 1 result(s)</p>
        </div>
        <div className="item center">
          <button className="load-more">Load More</button>
        </div>
        <div className="item right">
          <p>Total of 1 result(s)</p>
        </div>
      </div>
    </div>
  );
};

export default TableAccounts;
