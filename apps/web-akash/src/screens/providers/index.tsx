import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { NextSeo } from 'next-seo';
import Layout from '@components/layout';
import { useStyles } from './styles';
import { DataBlocks, Memory, Compute, Storage, ProvidersList } from './components';
import { useProviders } from './hooks';

const Providers = () => {
  const { t } = useTranslation('providers');
  const classes = useStyles();
  const { state, handleSearch } = useProviders();

  return (
    <>
      <NextSeo
        title={t('providers')}
        openGraph={{
          title: t('providers'),
        }}
      />
      <Layout navTitle={t('providers')} className={classes.root}>
        <DataBlocks
          className={classes.dataBlocks}
          providers={state.activeProvidersCount}
          leases={state.activeLeasesCount}
        />
        <Memory className={classes.memory} memory={state.memory} />
        <Compute className={classes.compute} compute={state.cpu} />
        <Storage className={classes.storage} storage={state.storage} />
        <ProvidersList
          className={classes.providersList}
          list={state.providers}
          handleSearch={handleSearch}
        />
      </Layout>
    </>
  );
};

export default Providers;