FROM node:22-alpine
WORKDIR /app
COPY server.js ./
COPY public ./public
EXPOSE 3000
HEALTHCHECK --interval=3s --timeout=3s --retries=20 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
