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
import {dateTimeWithTimeZone} from 'gmp/locale/date';

import SeverityBar from 'web/components/bar/severitybar';

import CpeLogoIcon from 'web/components/icon/cpelogoicon';
import ExportIcon from 'web/components/icon/exporticon';
import ManualIcon from 'web/components/icon/manualicon';
import ListIcon from 'web/components/icon/listicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import DetailsLink from 'web/components/link/detailslink';

import Table from 'web/components/table/stripedtable';
import TableHeader from 'web/components/table/header';
import TableHead from 'web/components/table/head';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import DetailsBlock from 'web/entity/block';
import EntityPage from 'web/entity/page';
import EntityComponent from 'web/entity/component';
import {InfoLayout} from 'web/entity/info';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer from 'web/entity/withEntityContainer';

import {selector, loadEntity} from 'web/store/entities/cpes';

import PropTypes from 'web/utils/proptypes';

import CpeDetails from './details';

const ToolBarIcons = ({entity, onCpeDownloadClick}) => (
  <Divider margin="10px">
    <IconDivider>
      <ManualIcon
        page="vulnerabilitymanagement"
        anchor="cpe"
        title={_('Help: CPEs')}
      />
      <ListIcon title={_('CPE List')} page="cpes" />
    </IconDivider>
    <ExportIcon
      value={entity}
      title={_('Export CPE')}
      onClick={onCpeDownloadClick}
    />
  </Divider>
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onCpeDownloadClick: PropTypes.func.isRequired,
};

const EntityInfo = ({entity}) => {
  const {id, modificationTime, creationTime, updateTime} = entity;
  return (
    <InfoLayout>
      <div>{_('ID:')}</div>
      <div>{id}</div>
      <div>{_('Modified:')}</div>
      <div>{dateTimeWithTimeZone(modificationTime)}</div>
      <div>{_('Created:')}</div>
      <div>{dateTimeWithTimeZone(creationTime)}</div>
      <div>{_('Last updated:')}</div>
      <div>{dateTimeWithTimeZone(updateTime)}</div>
    </InfoLayout>
  );
};

EntityInfo.propTypes = {
  entity: PropTypes.model.isRequired,
};

const Details = ({entity, links = true}) => {
  const {cves} = entity;
  return (
    <Layout flex="column">
      <CpeDetails entity={entity} />
      <DetailsBlock title={_('Reported Vulnerabilities')}>
        {cves.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_('Name')}</TableHead>
                <TableHead>{_('Severity')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cves.map(cve => (
                <TableRow key={cve.id}>
                  <TableData>
                    <DetailsLink id={cve.id} type="cve" textOnly={!links}>
                      {cve.id}
                    </DetailsLink>
                  </TableData>
                  <TableData>
                    <SeverityBar severity={cve.severity} />
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          _('None')
        )}
      </DetailsBlock>
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
};

const CpePage = ({
  entity,
  onChanged,
  onDownloaded,
  onError,
  onInteraction,
  ...props
}) => (
  <EntityComponent
    name="cpe"
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInteraction={onInteraction}
  >
    {({download}) => (
      <EntityPage
        {...props}
        entity={entity}
        sectionIcon={<CpeLogoIcon size="large" />}
        title={_('CPE')}
        infoComponent={EntityInfo}
        toolBarIcons={ToolBarIcons}
        onCpeDownloadClick={download}
        onInteraction={onInteraction}
      >
        {({activeTab = 0, onActivateTab}) => {
          return (
            <Layout grow="1" flex="column">
              <TabLayout grow="1" align={['start', 'end']}>
                <TabList
                  active={activeTab}
                  align={['start', 'stretch']}
                  onActivateTab={onActivateTab}
                >
                  <Tab>{_('Information')}</Tab>
                  <EntitiesTab entities={entity.userTags}>
                    {_('User Tags')}
                  </EntitiesTab>
                </TabList>
              </TabLayout>

              <Tabs active={activeTab}>
                <TabPanels>
                  <TabPanel>
                    <Details entity={entity} />
                  </TabPanel>
                  <TabPanel>
                    <EntityTags
                      entity={entity}
                      onChanged={onChanged}
                      onError={onError}
                      onInteraction={onInteraction}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Layout>
          );
        }}
      </EntityPage>
    )}
  </EntityComponent>
);

CpePage.propTypes = {
  entity: PropTypes.model,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

export default withEntityContainer('cpe', {
  load: loadEntity,
  entitySelector: selector,
})(CpePage);

// vim: set ts=2 sw=2 tw=80:
