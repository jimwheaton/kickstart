import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from '../routes';

class RequestRow extends Component {

    state = {
        approving: false,
        finalizing: false
    };

  onApprove = async () => {
    const { address, id } = this.props;
    const campaign = Campaign(address);

    this.setState({ approving: true });
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    });
    this.setState({ approving: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    const { address, id } = this.props;
    const campaign = Campaign(address);
    this.setState({ finalizing: true });
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0]
    });
    this.setState({ finalizing: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount} / {approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove} loading={this.state.approving}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize } loading={this.state.finalizing}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
