#!/bin/bash

directory="/HLS"

declare -A file_cids

files=$(ipfs files ls $directory | grep 'patron a buscar')

if [[ -z "$files" ]]; then
    echo "No hay archivos chunk-stream en $directory."
    exit 1
fi

output_file=""

while IFS= read -r files; do
    cid=$(ipfs files stat --hash "$directory/$file")
    file_cids["$file"]=$cid
    echo "$files: $cid" >> "$output_file"
done <<< "$files"

echo "Los CIDs de los archivos han sido escritos en $output_file."
