FROM node:16.18.1
RUN rm -f /etc/localtime
RUN ln -s /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
RUN npm install -g npm@8.19.2
RUN npm install -g http-server
COPY dist/ dist
EXPOSE 8080
CMD [ "http-server", "dist" ]
