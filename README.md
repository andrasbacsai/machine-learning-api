# Machine Learning API

This is the codebase of [ml.andrasbacsai.dev](https://ml.andrasbacsai.dev) where I publish a freely available Machine Learning API. 

It reflects my current knowledge about it, which is not much, but honest work. 😁

# Currently available 
- Tensorflow.js ImageClassifier

# How to use?
1. Go to [Teachablemachine](https://teachablemachine.withgoogle.com/train/image) and add images to different classes.
2. Save the model with a shareable link and copy the link. (e.g., https://teachablemachine.withgoogle.com/models/3RcVEQiII/)
3. Send a POST request to https://ml.andrasbacsai.dev/api/tensorflowjs/imageClassifier, with the following data:
```JSON
{
    "modelUrl": "<URL to the directory of your model files>",
    "imageUrl": "<URL example image you would like to classify>"
}
```
4. Ta-da. 🎉

> Classification does not work perfectly! There are so many things to learn/tweak in this field.

# Example 

```bash 
curl -X POST -H "Content-type: application/json" -d '{"modelUrl":"https://teachablemachine.withgoogle.com/models/3RcVEQiII/","imageUrl":"https://www.rover.com/blog/wp-content/uploads/2018/12/dog-sneeze-1-1024x945.jpg"}' https://ml.andrasbacsai.dev/api/tensorflowjs/imageClassifier
```

# Roadmap
- Frontend to see what's going on
- Teach model without teachablemachine.
- Who knows?!

Follow me on Twitter at [@andrasbacsai](https://twitter.com/andrasbacsai) to get updates or star this repository.

# Why?
I'm just sharing my knowledge in a format of an API so others could learn/play/use it! I could not find any good publicly available service to try it ML things out quickly. That's why I'm publishing my work.

# License
MIT


