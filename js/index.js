const inputs = document.querySelectorAll('.input');

    function foucusFunc(){
        let parent =this.parentNode.parentNode;
        parent.classList.add('focus')
    
    };
    function blurFunc(){
        let parent = this.parentNode.parentNode;
        if(this.value == "" ){
          parent.classList.remove('focus')  
        }
        
    };
inputs.forEach(input => {
    input.addEventListener('focus', foucusFunc);
    input.addEventListener('blur', blurFunc);
})