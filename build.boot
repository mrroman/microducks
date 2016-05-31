(set-env! :resource-paths #{"src"}
          :dependencies '[[pandeiro/boot-http "0.7.3"]])

(require '[pandeiro.boot-http :refer [serve]])

(deftask start []
  (comp
   (serve :dir "resources/")))
