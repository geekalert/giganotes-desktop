#include <nan.h>
#include <sstream>

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;

NAN_METHOD(Fibo) {    // Return it to node engine
    info.GetReturnValue().Set(Nan::New<String>("Hello").ToLocalChecked());
}

void InitAll(Handle<Object> exports) {
  // Method that returns the generated Fibonacci sequence as a string:
  exports->Set(Nan::New<String>("fibo").ToLocalChecked(),
    Nan::New<FunctionTemplate>(Fibo)->GetFunction());
}

NODE_MODULE(addon, InitAll)
