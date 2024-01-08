import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '信心',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        你们若有信心像一粒芥菜种，就是对这座山说：你从这边挪到那边，它也必挪去，并且你们没有一件不能做的事了
      </>
    ),
  },
  {
    title: '不要害怕',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        你不要害怕，因为我与你同在；不要惊惶，因为我是你的神。我必坚固你，我必帮助你，我必用我公义的右手扶持你
      </>
    ),
  },
  {
    title: '更深经历',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        把船开到水深之处，下网打鱼
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
