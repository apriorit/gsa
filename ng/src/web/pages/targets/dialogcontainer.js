/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import Layout from '../../components/layout/layout.js';

import PropTypes from '../../utils/proptypes.js';
import {first} from 'gmp/utils';

import CredentialsDialog from '../credentials/dialog.js';

import PortListDialog from '../portlists/dialog.js';

import TargetDialog from './dialog.js';

class TargetDialogContainer extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      credentialsDialogVisible: false,
      portListDialogVisible: false,
    };

    this.openCredentialsDialog = this.openCredentialsDialog.bind(this);
    this.closeCredentialsDialog = this.closeCredentialsDialog.bind(this);
    this.openPortListDialog = this.openPortListDialog.bind(this);
    this.closePortListDialog = this.closePortListDialog.bind(this);
    this.handleCreateCredential = this.handleCreateCredential.bind(this);
    this.handleCreatePortList = this.handleCreatePortList.bind(this);
    this.handleSaveTarget = this.handleSaveTarget.bind(this);
  }

  openCredentialsDialog(data) {
    this.setState({
      credentialsDialogVisible: true,
      types: data.types,
      base: first(data.types),
      id_field: data.id_field,
      title: data.title,
    });
  }

  closeCredentialsDialog() {
    this.setState({credentialsDialogVisible: false});
  }

  show(state, options) {
    const {gmp} = this.context;

    this.setState(state, options);

    gmp.portlists.getAll().then(response => {
      const {data: port_lists} = response;
      this.port_lists = port_lists;
      this.setState({port_lists});
    });

    gmp.credentials.getAll().then(response => {
      const {data: credentials} = response;
      this.credentials = credentials;
      this.setState({credentials});
    });
  }

  openPortListDialog() {
    this.setState({portListDialogVisible: true});
  }

  closePortListDialog() {
    this.setState({portListDialogVisible: false});
  }

  handleSaveTarget(data) {
    const {gmp} = this.context;
    const {onSave} = this.props;

    let promise;
    if (data && data.id) {
      promise = gmp.target.save(data);
    }
    else {
      promise = gmp.target.create(data);
    }
    return promise.then(response => {
      const target = response.data;
      if (onSave) {
        return onSave(target);
      }
      return undefined;
    });
  }

  handleCreateCredential(data) {
    const {gmp} = this.context;
    return gmp.credential.create(data).then(response => {
      const credential = response.data;
      const {credentials = []} = this;
      credentials.push(credential);

      this.setState({
        credentials,
        id_field: data.id_field,
        credential_id: credential.id,
      });
    });
  }

  handleCreatePortList(data) {
    const {gmp} = this.context;
    return gmp.portlist.create(data).then(response => {
      const portlist = response.data;
      const {port_lists = []} = this;
      port_lists.push(portlist);

      this.setState({
        port_lists,
        port_list_id: portlist.id,
      });
    });
  }

  render() {
    const {
      onClose,
      ...props
    } = this.props;

    const {
      base,
      credentialsDialogVisible,
      id_field,
      portListDialogVisible,
      title,
      types,
      ...other
    } = this.state;

    return (
      <Layout>
        <TargetDialog
          {...props}
          {...other}
          onNewCredentialsClick={this.openCredentialsDialog}
          onNewPortListClick={this.openPortListDialog}
          onClose={onClose}
          onSave={this.handleSaveTarget}
        />
        <CredentialsDialog
          visible={credentialsDialogVisible}
          types={types}
          base={base}
          id_field={id_field}
          title={title}
          onClose={this.closeCredentialsDialog}
          onSave={this.handleCreateCredential}
        />
        <PortListDialog
          visible={portListDialogVisible}
          onClose={this.closePortListDialog}
          onSave={this.handleCreatePortList}
        />
      </Layout>
    );
  }
};

TargetDialogContainer.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

TargetDialogContainer.contextTypes = {
  gmp: PropTypes.gmp.isRequired,
};

export default TargetDialogContainer;

// vim: set ts=2 sw=2 tw=80:
