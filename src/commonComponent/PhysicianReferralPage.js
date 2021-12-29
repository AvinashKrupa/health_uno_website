import React, { Component } from "react";
import { Table } from "react-bootstrap";

const PhysicianReferralPage = (props) => {
  return (
    <div>
      <p className="invite_heading">Terms and Conditions</p>
      <ol type="1" className="invite_list">
        <li>
          Healthuno Healthcare India Private Limited is running a referral
          programme for the physicians who are using the Healthuno app with the
          below mentioned offers and discounts for each appointment booked on
          the Healthuno app on the Android/IoS apps as well as on the website
          <a href="https://www.healthuno.com" target="_blank">
            &nbsp;www.healthuno.com
          </a>
        </li>
        <br />
        <li>
          The Healthuno Doctor app and Healthuno Doctor Website are currently
          free for all users for a limited time. Physicians who get on boarded
          within the stipulated timeframe and conditions will continue to get
          lifetime free access to the Healthuno platform. Physicians who are on
          boarded after this period will be required to pay an Annual
          subscription/Monthly subscription/Retainer fees to Healthuno
          Healthcare India Pvt Ltd as per the terms and conditions applicable
          and determined by Healthuno.
        </li>
        <br />
        <li>
          Physicians participating in the Referral programme are eligible for
          the Preferred Physician Program which will display the participating
          physician’s profile as a “Top Consultant” on the website and app’s
          main landing page or “Suggested Physicians” when the patients are
          searching for Physicians of the same specialty.
        </li>
        <br />
        <li>
          Referring physicians are also eligible for a free subscription to the
          Healthuno Clinic Management Software and Healthuno Prescription
          Software depending on their current tier of referral in the referral
          programme.
        </li>
        <br />
        <li>
          A “Referee” is the person who shares the Healthuno app with their
          colleagues and peers to avail the discounts and participate in the
          Referral programme. A “Referred Member” is the person who gets on
          boarded as a partner physician through the “Refer and Invite”
          Programme and participates in the Referral programme.
        </li>
        <br />
        <li>
          A “Referral” which is mentioned below implies a physician who has been
          on boarded on the Healthuno platform after submitting the application
          and relevant documents and due diligence done by the Healthuno team.
          This does not include those physicians who have registered on the
          platform but have not been on boarded due to any reason including
          missing documents, refusal to submit documents etc. or those
          physicians who have only registered and have not yet completed the on
          boarding process in whole.
        </li>
        <br />
        <li>
          Any physicians who decide to leave the Healthuno platform post
          referral by a referring physician within a period of six months from
          the date of on boarding will not be eligible for the below referral
          campaign.
        </li>
        <br />
        <li>
          Healthuno Healthcare India Pvt Ltd reserves the right to modify,
          suspend or stop this Referral Program with prior notice or without
          intimation subject to their discretion and internal policies. The
          users who are part of this Referral Program explicitly agree to the
          aforementioned terms and conditions and give consent to the same.
        </li>
        <br />
        <li>
          The benefits received from the physician referral programme are
          non-transferrable and cannot be exchanged for cash or credits of
          equivalent value. The user shall ensure that they will utilize the
          benefits of the Referral Programme within the stipulated timeframe.
          Healthuno Healthcare India Private Limited will not be responsible or
          will not be accountable if the user fails to redeem the appropriate
          rewards and vouchers within the stipulated timeframes.
        </li>
        <br />
        <li>
          For more detailed terms and conditions for using the Healthuno app and
          website kindly refer the URL
          <a
            target="_blank"
            href="https://www.healthuno.com/terms-and-conditions/"
          >
            &nbsp;https://www.healthuno.com/terms-and-conditions/
          </a>
        </li>
      </ol>
      <Table responsive striped bordered>
        <thead>
          <tr>
            <th>Number of Referrals</th>
            <th>Healthuno Prime Access</th>
            <th>Healthuno Prescription Software</th>
            <th>Healthuno Clinic Management Software</th>
            <th>Healthuno Top Consultants Program</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1-20</th>
            <th>Free One Year Access</th>
            <th>Free One Year Access</th>
            <th>Free One Year Access</th>
            <th></th>
          </tr>
          <tr>
            <th>20-30</th>
            <th>Free Two Year Access</th>
            <th>Free Two Year Access</th>
            <th>Free Two Year Access</th>
            <th></th>
          </tr>
          <tr>
            <th>30-40</th>
            <th>Free Three Year Access</th>
            <th>Free Three Year Access</th>
            <th>Free Three Year Access</th>
            <th></th>
          </tr>
          <tr>
            <th>40-50</th>
            <th>Free Four Year Access</th>
            <th>Free Four Year Access</th>
            <th>Free Four Year Access</th>
            <th></th>
          </tr>
          <tr>
            <th>50-60</th>
            <th>Free Five Year Access</th>
            <th>Free Five Year Access</th>
            <th>Free Five Year Access</th>
            <th></th>
          </tr>
          <tr>
            <th>60-70</th>
            <th>Lifetime Free Access</th>
            <th>Free Lifetime Access</th>
            <th>Free Lifetime Access</th>
            <th>Eligible</th>
          </tr>
          <tr>
            <th>70-80</th>
            <th>Lifetime Free Access</th>
            <th>Free Lifetime Access</th>
            <th>Free Lifetime Access</th>
            <th>Eligible</th>
          </tr>
          <tr>
            <th>80-90</th>
            <th>Lifetime Free Access</th>
            <th>Free Lifetime Access</th>
            <th>Free Lifetime Access</th>
            <th>Eligible</th>
          </tr>
          <tr>
            <th>90-100</th>
            <th>Lifetime Free Access</th>
            <th>Free Lifetime Access – Two Users</th>
            <th>Free Lifetime Access – Two Users</th>
            <th>Eligible</th>
          </tr>
          <tr>
            <th>100+</th>
            <th>Lifetime Free Access</th>
            <th>Free Lifetime Access – Two Users</th>
            <th>Free Lifetime Access – Three Users</th>
            <th>Eligible</th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
export default PhysicianReferralPage;
