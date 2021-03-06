/* Copyright (C) 2017-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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

import _ from 'gmp/locale';

import {
  SMB_CREDENTIAL_TYPES,
  smb_credential_filter,
} from 'gmp/models/credential';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';

import {renderSelectItems} from 'web/utils/render';
import withPrefix from 'web/utils/withPrefix';

import Select from 'web/components/form/select';
import FormGroup from 'web/components/form/formgroup';
import TextField from 'web/components/form/textfield';

import NewIcon from 'web/components/icon/newicon';

const SmbMethodPart = ({
  prefix,
  credentials = [],
  reportFormats,
  smbCredential,
  smbFilePath,
  smbReportFormat,
  smbSharePath,
  onChange,
  onNewCredentialClick,
  onCredentialChange,
}) => {
  credentials = credentials.filter(smb_credential_filter);
  return (
    <Layout flex="column" box grow="1">
      <FormGroup title=" ">
        <span>
          {_(
            'Security note: The SMB protocol does not offer a ' +
              'fingerprint to establish complete mutual trust. Thus a ' +
              'man-in-the-middle attack can not be fully prevented.',
          )}
        </span>
      </FormGroup>

      <FormGroup title={_('Credential')}>
        <Divider>
          <Select
            name={prefix + 'smb_credential'}
            items={renderSelectItems(credentials)}
            value={smbCredential}
            onChange={onCredentialChange}
          />
          <Layout>
            <NewIcon
              size="small"
              value={SMB_CREDENTIAL_TYPES}
              title={_('Create a credential')}
              onClick={onNewCredentialClick}
            />
          </Layout>
        </Divider>
      </FormGroup>

      <FormGroup title={_('Share path')}>
        <TextField
          grow="1"
          name={prefix + 'smb_share_path'}
          maxLength="256"
          value={smbSharePath}
          onChange={onChange}
        />
      </FormGroup>

      <FormGroup title={_('File path')}>
        <TextField
          grow="1"
          name={prefix + 'smb_file_path'}
          maxLength="256"
          value={smbFilePath}
          onChange={onChange}
        />
      </FormGroup>

      <FormGroup title={_('Report Format')}>
        <Select
          name={prefix + 'smb_report_format'}
          items={renderSelectItems(reportFormats)}
          value={smbReportFormat}
          onChange={onChange}
        />
      </FormGroup>
    </Layout>
  );
};

SmbMethodPart.propTypes = {
  credentials: PropTypes.array,
  prefix: PropTypes.string,
  reportFormats: PropTypes.array,
  smbCredential: PropTypes.id,
  smbFilePath: PropTypes.string.isRequired,
  smbReportFormat: PropTypes.id,
  smbSharePath: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCredentialChange: PropTypes.func.isRequired,
  onNewCredentialClick: PropTypes.func.isRequired,
};

export default withPrefix(SmbMethodPart);

// vim: set ts=2 sw=2 tw=80:
