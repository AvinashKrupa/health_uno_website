import React, { Component } from "react";
import { Table } from "react-bootstrap";

const ReferInvite = (props) => {
  return (
    <div>
      <p className="invite_heading">Terms and Conditions</p>
      <ol type="1" className="invite_list">
        <li>
          Healthuno Healthcare India Private Limited is running a referral
          programme for the patients who are using the Healthuno app with the
          below mentioned offers and discounts for each appointment booked on
          the Healthuno app on the Android/IoS apps as well as on the website
          <a href="www.healthuno.com" target="_blank">
            &nbsp;www.healthuno.com
          </a>
        </li>
        <br />
        <li>
          A “Referee” is the person who shares the Healthuno app with their
          friends and family members to avail the discounts and participate in
          the Referral programme. A “Referred Member” is the person who books an
          appointment through the “Refer and Invite” Programme and participates
          in the Referral programme.
        </li>
        <br />
        <li>
          A “Referral” which is mentioned below implies a booked and completed
          appointment on the Healthuno platform with one of our consultants by
          paying the consultation fees in full. This does not include
          appointments booked using any ongoing offers/coupon codes or any
          follow up review appointments which is free (Terms and Conditions
          apply). Appointments booked using the below mentioned offer codes will
          be eligible for the referral programme.
        </li>
        <br />
        <li>
          Any Appointments cancelled after booking will not be eligible for the
          below referral campaign. An appointment once booked and cancelled will
          automatically revert back to the previous tier of referral and the
          referral campaign will proceed as per the below sequence. Ex: A
          Seventh referral booked will give the Referee a 35% discount on their
          next booking. If the Referred Member cancelled their booked
          appointment, then the Referee’s tier will automatically revert back to
          the previous segment – 30% discount. When the Referee refers another
          successful Member, the Referee will be moved to the next tier of the
          Referral Program.
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
          Discount coupons are non-transferrable and cannot be exchanged for
          cash vouchers or equivalent credits. The user shall ensure that they
          will utilize the benefits of the Referral Programme within the
          stipulated timeframe. Healthuno Healthcare India Private Limited will
          not be responsible or will not be accountable if the user fails to
          redeem the appropriate rewards and vouchers within the stipulated
          timeframes.
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
            <th>Referral Number</th>
            <th>Referral Discount on next consultation</th>
            <th>Healthuno Club Membership Discount</th>
            <th>Healthuno Pharmacy Discount</th>
            <th>Healthuno Clinic At Home Discount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>First Referral</th>
            <th>5% Discount on Next Consultation</th>
            <th>10%</th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th>Second Referral</th>
            <th>10% Discount on next consultation</th>
            <th>20%</th>
            <th>5%</th>
            <th></th>
          </tr>
          <tr>
            <th>Third Referral</th>
            <th>15%</th>
            <th>30%</th>
            <th>5%</th>
            <th>5%</th>
          </tr>
          <tr>
            <th>Fourth Referral</th>
            <th>20%</th>
            <th>40%</th>
            <th>5%</th>
            <th>10%</th>
          </tr>
          <tr>
            <th>Fifth Referral</th>
            <th>25%</th>
            <th>50%</th>
            <th>5%</th>
            <th>15%</th>
          </tr>
          <tr>
            <th>Sixth Referral</th>
            <th>30%</th>
            <th>60%</th>
            <th>5%</th>
            <th>20%</th>
          </tr>
          <tr>
            <th>Seventh Referral</th>
            <th>35%</th>
            <th>70%</th>
            <th>10%</th>
            <th>25%</th>
          </tr>
          <tr>
            <th>Eight Referral</th>
            <th>40%</th>
            <th>80%</th>
            <th>10%</th>
            <th>30%</th>
          </tr>
          <tr>
            <th>Ninth Referral</th>
            <th>45%</th>
            <th>90%</th>
            <th>10%</th>
            <th>35%</th>
          </tr>
          <tr>
            <th>Tenth Referral</th>
            <th>50%</th>
            <th>95%</th>
            <th>10%</th>
            <th>40%</th>
          </tr>
          <tr>
            <th>Eleventh Referral</th>
            <th>55%</th>
            <th>Complimentary membership – 1 Year</th>
            <th>10%</th>
            <th>45%</th>
          </tr>
          <tr>
            <th>Twelfth Referral</th>
            <th>60%</th>
            <th>Complimentary membership – 1 Year</th>
            <th>15%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Thirteenth Referral</th>
            <th>65%</th>
            <th>Complimentary 2 Year membership</th>
            <th>15%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Fourteenth Referral</th>
            <th>70%</th>
            <th>Complimentary 2 Year membership</th>
            <th>15%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Fifteenth Referral</th>
            <th>75%</th>
            <th>Complimentary 2 Year membership</th>
            <th>15%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Sixteenth Referral</th>
            <th>80%</th>
            <th>Complimentary 2 Year membership</th>
            <th>15%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Seventeenth Referral</th>
            <th>85%</th>
            <th>Complimentary 2 Year membership</th>
            <th>20%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Eighteenth Referral</th>
            <th>90%</th>
            <th>Complimentary 3 Year membership</th>
            <th>20%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Nineteenth Referral</th>
            <th>95%</th>
            <th>Complimentary 3 Year membership</th>
            <th>20%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Twentieth Referral</th>
            <th>100%</th>
            <th>Complimentary 3 Year membership</th>
            <th>20%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
          <tr>
            <th>Twenty one and Above</th>
            <th>Permanent 20% Flat Discount on all consultations.</th>
            <th>Complimentary Lifetime membership</th>
            <th>20%</th>
            <th>50% Flat Discount on all services</th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
export default ReferInvite;
