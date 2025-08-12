import blockContent from './blockContent'
// import category from './category'
// import post from './post'
// import author from './author'
import localizedString from './objects/localizedString'
import localizedBlockContent from "./objects/localizedBlockContent";
import tail from "./tail";
import post from "./post";
import report from "./report";
import events from "./events";
import collection from './collection';
import donator from './donator';

export const schemaTypes = [donator, collection, events, tail, post, report, blockContent, localizedString, localizedBlockContent]
