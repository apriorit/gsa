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

import {isDefined} from 'gmp/utils/identity';

import {OSP_SCAN_CONFIG_TYPE} from 'gmp/models/scanconfig';

import PropTypes from 'web/utils/proptypes';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import {Col} from 'web/entity/page';

const ScanConfigDetails = ({entity}) => {
  const {comment, scan_config_type, scanner, tasks = []} = entity;
  return (
    <Layout flex="column" grow>
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          {isDefined(comment) && (
            <TableRow>
              <TableData>{_('Comment')}</TableData>
              <TableData>{comment}</TableData>
            </TableRow>
          )}
          {scan_config_type === OSP_SCAN_CONFIG_TYPE && isDefined(scanner) && (
            <TableRow>
              <TableData>{_('Scanner')}</TableData>
              <TableData>
                <DetailsLink type="scanner" id={scanner.id}>
                  {scanner.name}
                </DetailsLink>
              </TableData>
            </TableRow>
          )}

          {tasks.length > 0 && (
            <TableRow>
              <TableData>{_('Tasks using this Scan Config')}</TableData>
              <TableData>
                <Divider wrap>
                  {tasks.map(task => (
                    <DetailsLink key={task.id} id={task.id} type="task">
                      {task.name}
                    </DetailsLink>
                  ))}
                </Divider>
              </TableData>
            </TableRow>
          )}
        </TableBody>
      </InfoTable>
    </Layout>
  );
};

ScanConfigDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default ScanConfigDetails;

// vim: set ts=2 sw=2 tw=80:
