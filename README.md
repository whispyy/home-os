# Home Board

### env

You can set the `VITE_DEFAULT_SERVICES` to an array object following the `Service` interface defined in `/src/utils/service.ts` to prefill some services on your board.

__example:__

```JSON
[{"name":"Plex","url":"http://192.168.1.12:32400","imgUrl":"/services/plex.svg","description":""},{"name":"Tautulli","url":"http://192.168.1.12:8181","imgUrl":"/services/tautulli.png","description":"Plex monitoring tool"},{"name":"Jellyfin","url":"http://192.168.1.12:8096","imgUrl":"/services/jellyfin.png"},{"name":"Sonarr","url":"http://192.168.1.12:8989/","imgUrl":"/services/sonarr.svg"}, {"name":"Radarr","url":"http://192.168.1.12:7878/","imgUrl":"/services/radarr.png"}]
```

### local development

First you need to `npm install`

Then:

- running local instance `npm start`
- building local instance `npm run build`
- see local build after having built `npm run preview`
